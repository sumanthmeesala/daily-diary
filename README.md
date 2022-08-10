# daily-dairy




- What is daily diary
    - Digital dairy that you can post dairies and view old ones
    - Like a social networking site but your own self
- Tech Stack (Technologies and frameworks)
    - Python
        - Flask (Web Endpoint)
        - Flask-Login (To maintain user session)
        - Peewee (ORM - Object Relation Mapping)
    - UI
        - HTML
        - Bootstrap 4 (CSS - Framework)
        - JQuery (JavaScript)
    - DB 
        - Sqlite (Because, it goes well with Python test projects)
- MVC (Design Pattern)
    - Model : Python Objects
    - Views : HTML pages with Python jinja2 scripts
    - Controller: Flask endpoints controllers
- Modules:
    - User Module
        - Login / Logout
        - Sign-up
        - Update Profile information
        - Change password
    - Dairy Module
        - Post daily dairy
        - View previous dairies
- Schema
    - User:
        - UserName
        - EnPassword
        - DOB
        - Email
        - Mobile
        - FullName
        - DP
    - Dairy
        - User (foreign-key policy)
        - Date
        - Time
        - Subject
        - Text
- Site walkthrough 
- Code walkthrough 
- Future Improvements
    - Post images as dairies
    - Send notification via email/text messages/push notifications
    - Save calendar days