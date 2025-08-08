# 🚀 GitHub-ზე ატვირთვის ინსტრუქცია

## 📋 ნაბიჯები

### 1. Git-ის ინსტალაცია
1. გადადით: https://git-scm.com/download/win
2. ჩამოტვირთეთ Windows-ისთვის
3. დააინსტალირეთ (ყველა ნაბიჯზე "Next" დააჭირეთ)
4. გადატვირთეთ კომპიუტერი

### 2. GitHub-ზე Repository-ის შექმნა
1. გადადით: https://github.com
2. შექმენით ანგარიში (თუ არ გაქვთ)
3. დააჭირეთ "New repository"
4. შეიყვანეთ სახელი: `todo-app`
5. აირჩიეთ "Public"
6. **არ დააჭიროთ** "Add a README file"
7. დააჭირეთ "Create repository"

### 3. ფაილების ატვირთვა
PowerShell-ში შეასრულეთ ეს ბრძანებები:

```bash
# Git-ის კონფიგურაცია
git config --global user.name "თქვენი სახელი"
git config --global user.email "თქვენი@email.com"

# Repository-ის ინიციალიზაცია
git init

# ფაილების დამატება
git add .

# პირველი commit
git commit -m "Initial commit: Beautiful TODO application"

# GitHub-თან დაკავშირება
git remote add origin https://github.com/თქვენი-username/todo-app.git
git branch -M main
git push -u origin main
```

### 4. ალტერნატიული გზა - GitHub Desktop
1. ჩამოტვირთეთ: https://desktop.github.com/
2. დააინსტალირეთ
3. შექმენით ახალი repository
4. დაამატეთ ყველა ფაილი
5. გამოაქვეყნეთ

## 📁 ფაილები რომლებიც ატვირთება
- ✅ `index.html` - მთავარი HTML ფაილი
- ✅ `styles.css` - ყველა სტილი და ანიმაცია
- ✅ `script.js` - JavaScript ფუნქციონალი
- ✅ `README.md` - ქართული დოკუმენტაცია
- ✅ `README_EN.md` - ინგლისური დოკუმენტაცია
- ✅ `.gitignore` - Git ignore ფაილი

## 🌐 ლაივ დემო
GitHub-ზე ატვირთვის შემდეგ, თქვენი აპლიკაცია ხელმისაწვდომი იქნება:
`https://თქვენი-username.github.io/todo-app/`

## 📞 დახმარება
თუ პრობლემა გაქვთ:
1. შეამოწმეთ რომ Git დაინსტალირებულია: `git --version`
2. შეამოწმეთ რომ GitHub-ზე ხართ დალოგინებული
3. შეამოწმეთ repository-ის URL სწორია

---
**წარმატებები! 🎉**
