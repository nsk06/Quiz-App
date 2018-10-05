package main

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/qor/admin"
	"golang.org/x/crypto/bcrypt"
)

// declaring the db globally
var db *gorm.DB
var err error
var activeUser int

type User struct {
	ID       uint   `json:"id"` //if provided then that id else autoincrement
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	SignedIn uint   `json:"loggedin"`
	Admin    bool   `json:"admin"`
}

type Genre struct {
	ID        uint   `json:"id"`
	Genrename string `json:"genrename"`
}
type Quize struct {
	ID       uint   `json:"id"`
	Quizname string `json:"quizname"`
	//Genre    Genre  `json:"foreignkey:Genid;association_foreignkey:ID"`
	Genid uint `sql:"type:bigint REFERENCES genres(id)"`
}

type Question struct {
	ID       uint   `json:"id"`
	Question string `json:"question"`
	//Quiz     Quiz   `gorm:"foreignkey:QuizID;association_foreignkey:ID"`
	Quizid  uint   `sql:"type:bigint REFERENCES quizes(id)"`
	OptionA string `json:"first"`
	OptionB string `json:"second"`
	OptionC string `json:"third"`
	OptionD string `json:"fourth"`
	Correct string `json:"answer"`
	Type    string `json:"qtype"`
}

type Score struct {
	ID uint `json:"id"`
	//Quiz  Quiz `gorm:"foreignkey:QuizID;association_foreignkey:ID"`
	//User  User `gorm:"foreignkey:Userid;association_foreignkey:ID"`
	Qid   uint   `sql:"type:bigint REFERENCES quizes(id)"`
	Qname string `json:"qname"`
	UID   uint   `sql:"type:bigint REFERENCES users(id)"`
	Uname string
	Total uint `json:"fullscore"`
}
type Mydata struct {
	Myid   uint `sql:"type:bigint REFERENCES users(id)"`
	Myname string
	Points uint `json:"fullscore"`
}
type LBgen struct {
	// ID uint `json:"id"`
	//Quiz Quiz `gorm:"foreignkey:QID;association_foreignkey:ID"`
	//User User `gorm:"foreignkey:Uid;association_foreignkey:ID"`
	Mygid   uint `sql:"type:bigint REFERENCES genres(id)"`
	USid    uint `sql:"type:bigint REFERENCES users(id)"`
	Usrname string
	Full    uint `json:"totalscore"`
}

// type LBall struct {
// 	ID uint `json:"id"`
// 	// Genre   Genre `gorm:"foreignkey:GID;association_foreignkey:ID"`
// 	// User    User  `gorm:"foreignkey:USid;association_foreignkey:ID"`
// 	Gid     uint `sql:"type:bigint REFERENCES genres(id)"`
// 	USRid   uint `sql:"type:bigint REFERENCES users(id)"`
// 	Overall uint `json:"allscore"`
// }

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14) //added salt
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

var curuser uint

func main() {
	curuser = 0
	db, err = gorm.Open("sqlite3", "./quiz.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()
	db.LogMode(true)
	db.Exec("PRAGMA foreign_keys = ON")
	db.AutoMigrate(&User{}, &Genre{}, &Question{}, &Quize{}, &Score{}, &LBgen{}, &Mydata{})
	r := gin.Default()
	r.POST("/register", Signup)
	r.POST("/login", Login)
	r.GET("/users", Getusers)
	r.GET("/genres", GetGenres)
	r.GET("/quiz/:id", GetQuizzes)
	r.GET("/question/:id", GetQuestions)
	r.POST("/scores/:qid", AddScore)
	r.GET("/genboard/:gid", Getgenboard)
	r.GET("/leaders", Getboard)
	r.GET("/recent", Getlist)
	Admin := admin.New(&admin.AdminConfig{DB: db})
	Admin.AddResource(&User{})
	Admin.AddResource(&Genre{})
	Admin.AddResource(&Question{})
	Admin.AddResource(&Quize{})
	// Admin.AddResource(&Score{})
	// Admin.AddResource(&LBall{})
	Admin.AddResource(&LBgen{})
	mux := http.NewServeMux()
	Admin.MountTo("/admin", mux)

	fmt.Println("Listening on: 8080")
	r.Any("/admin/*w", gin.WrapH(mux))
	// http.ListenAndServe(":8080", mux)
	// r.PUT("/people/:id", UpdatePerson)
	// r.DELETE("/people/:id", DeletePerson)
	// r.Use((cors.Default()))
	r.Run(":8080") // Run on port 8080
}

func Signup(c *gin.Context) {
	//email := c.PostForm("email")
	//fmt.Println("%s\n", email)
	//fmt.Println("hey")
	var user User
	//d := db.Where("email = ?", email).First(&user)
	//log.Printf("%+v", d)
	// if d != nil {
	// 	fmt.Println("dfdfwfwerfewrfwe")
	// 	c.AbortWithStatus(404)
	// 	fmt.Println("Email Already Exists")
	// 	// email already exists
	// }
	//fmt.Println("Entryyyyyyyy")
	c.BindJSON(&user)
	fmt.Println(user.Email)
	d := db.Where("email = ?", user.Email).Find(&user).RecordNotFound()
	if d {
		//fmt.Println("heu")
		db.Create(&user)
		// hash the password
		pass := user.Password
		fmt.Println(pass)
		hashed_pass, err := HashPassword(pass)
		if err == nil {
			fmt.Println(hashed_pass)
			db.Model(&user).Where("email = ?", user.Email).Update("Password", hashed_pass)
		}
		//db.Model(&user).Where("email = ?", user.Email).Update("Password", passs)
		//db.Model(&user).Where("email = ?", user.Email).Update("Score", 0)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, user)
	} else {
		fmt.Println("Already exits")
		c.AbortWithStatus(404)
	}
}

func Login(c *gin.Context) {
	var user User
	// Get the existing entry present in the database for the given username
	c.BindJSON(&user)
	email := user.Email
	password := user.Password

	res := db.Where("Email = ?", email).First(&user).RecordNotFound()

	if res {
		fmt.Println("User nOt exists please registere")
		// user doesn't exists
		c.AbortWithStatus(404)
		// fmt.Println(res.Error)
	} else {
		// Compare the stored hashed password, with the hashed version of the password that was received
		x := User{}
		db.Where("email = ?", email).First(&x)
		curuser = x.ID
		//fmt.Println(HashPassword(password))
		//fmt.Println(x.Password)
		result := CheckPasswordHash(password, x.Password)
		if result {
			fmt.Println("Logged IN")
			c.Header("access-control-allow-origin", "*")
			c.JSON(301, user)
		} else {
			c.AbortWithStatus(404)
			fmt.Println("Incorrect password")
		}
		//log.Printf("%+v", x)
		//fmt.Println(x.Password)
		//fmt.Println(password)
		// if password == user.Password {
		// 	// fmt.Printf("cjsjbkkscb\n")
		// 	db.Model(&user).Where("email = ?", email).Update("SignedIn", 1)
		// Why am I doing this? Find out. Try running with this line commented

		// }
	}
}
func Getusers(c *gin.Context) {
	var user []User
	if err := db.Find(&user).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, user)
	}
}
func GetGenres(c *gin.Context) {
	var gen []Genre
	if err := db.Find(&gen).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, gen)
	}

}
func GetQuizzes(c *gin.Context) {
	id := c.Params.ByName("id")
	var q []Quize
	if err := db.Where("Genid = ?", id).Find(&q).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, q)
	}
}
func GetQuestions(c *gin.Context) {
	id := c.Params.ByName("id")
	var qu []Question
	if err := db.Where("quizid = ?", id).Find(&qu).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, qu)
	}
}
func AddScore(c *gin.Context) {
	var data []string
	var user User
	var x User
	var s Score
	var m Mydata
	var o Quize
	var qu Quize
	c.BindJSON(&data)
	// fmt.Println("heya")
	fmt.Println(data)
	email := data[1]
	// fmt.Println(email)
	// id := data.Xid
	resid := db.Where("Email = ?", email).First(&user).Scan(&x)
	asd := db.Where("ID = ?", data[0]).First(&qu).Scan(&o)
	fmt.Println(asd)
	fmt.Println(o.Quizname)
	fmt.Println(resid)
	fmt.Println(x.ID)
	fmt.Println(x.Name)
	str, err := strconv.ParseUint(data[0], 10, 32)
	if err != nil {
		fmt.Println(err)
	} else {
		myvar := uint(str)
		check := db.Where(&Score{Qid: myvar, UID: x.ID}).First(&s).RecordNotFound()
		alter := db.Where(&Mydata{Myid: x.ID}).First(&m).RecordNotFound()
		if check {
			sc := Score{Qid: myvar, UID: x.ID, Total: 0, Uname: x.Name, Qname: o.Quizname}
			db.NewRecord(sc)
			db.Create(&sc)
			db.NewRecord(sc)
		}
		if alter {
			sc := Mydata{Myid: x.ID, Myname: x.Name, Points: 0}
			db.NewRecord(sc)
			db.Create(&sc)
			db.NewRecord(sc)
		}
		prevscore := db.Where(&Score{Qid: myvar, UID: x.ID}).First(&s).Scan(&s)
		fmt.Println(prevscore)
		fmt.Println("old")
		fmt.Println(s.Total)
		pre := db.Where(&Mydata{Myid: x.ID}).First(&m).Scan(&m)
		fmt.Println(pre)
		newscore := s.Total + 10
		new := m.Points + 10
		up := db.Model(&s).Where(&Score{Qid: myvar, UID: x.ID}).Update("Total", newscore)
		fmt.Println(up)
		qwer := db.Model(&m).Where(&Mydata{Myid: x.ID}).Update("Points", new)
		fmt.Println(qwer)
		checkupdate := db.Where(&Score{Qid: myvar, UID: x.ID}).First(&s).Scan(&s)
		fmt.Println(checkupdate)
		fmt.Println("nowcheck")
		fmt.Println(s.Total)
	}

}
func Getgenboard(c *gin.Context) {
	id := c.Params.ByName("gid")
	var q []Quize
	if err := db.Where("Genid = ?", id).Find(&q).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		l := len(q)
		var w LBgen
		my := make([]uint, 5000)
		for i := 0; i < l; i++ {
			fmt.Println("here")
			var s []Score
			r := db.Where("Qid = ?", q[i].ID).Find(&s)
			fmt.Println(r)
			// fmt.Println(s)
			x := len(s)
			e := strings.Replace(id, " ", "", -1)
			// fmt.Println(e)
			// fmt.Println(id)
			str, err := strconv.ParseUint(e, 10, 32)
			if err != nil {
				fmt.Println(err)

			} else {
				g := uint(str)
				// fmt.Println("print g")
				// fmt.Println(g)
				for k := 0; k < x; k++ {
					// f := false
					fmt.Println("again")
					b := s[k].UID
					my[b] += s[k].Total
					// fmt.Println(b)
					// fmt.Println(g)
					check := db.Where(&LBgen{Mygid: g, USid: b}).First(&w).RecordNotFound()
					if check {
						sc := LBgen{Mygid: g, USid: b, Full: my[b], Usrname: s[k].Uname}
						fmt.Println("yo")
						db.NewRecord(sc)
						hh := db.Where(&LBgen{Mygid: g, USid: b}).First(&w).RecordNotFound()
						if hh {
							db.Create(&sc)
						}
						db.NewRecord(sc)
					} else {
						// fmt.Println("heya")
						fmt.Println(w)
						db.Model(&w).Where(&LBgen{Mygid: g, USid: b}).Update("Full", my[b])
					}

				}
			}
		}
		var u []LBgen
		db.Order("Full desc").Where("Mygid = ?", id).Find(&u)
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, u)
	}
}
func Getboard(c *gin.Context) {
	var m []Mydata
	if err := db.Order("Points desc").Find(&m).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, m)
	}
}
func Getlist(c *gin.Context) {
	var s []Score
	if err := db.Where("UID = ?", curuser).Find(&s).Error; err != nil {
		c.AbortWithStatus(404)
		fmt.Println(err)
	} else {
		c.Header("access-control-allow-origin", "*") // Why am I doing this? Find out. Try running with this line commented
		c.JSON(200, s)
	}
}
