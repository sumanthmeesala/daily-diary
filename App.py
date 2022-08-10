from flask import Flask

from flask import request, render_template, redirect, jsonify
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user, current_user

import base64, json, datetime

app = Flask(__name__)

""" User Endpoints | START """

login_manager = LoginManager()
login_manager.init_app(app)

class UserMIXIN(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.unauthorized_handler
def unauthorized():
    return redirect('/login')

@login_manager.user_loader
def userLoader(userName):
    return UserMIXIN(userName)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        userName = request.form['userName'].lower()
        encryptedPassword = base64.b64encode(request.form['password'].encode('ascii')).decode('ascii')
        user = User.get_or_none(User.userName == userName, User.encryptedPassword == encryptedPassword)
        if user is None:
            return render_template('Login.html', error = 'Invalid Credentials!', userName=userName)
        else:
            login_user(UserMIXIN(user.userName))
            return redirect('/')

    return render_template('Login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/login')

@app.route('/signup', methods=['GET', 'POST'])
def signUp():
    if request.method == 'POST':
        fullName = request.form['fullName']
        userName = request.form['userName'].lower()
        encryptedPassword = base64.b64encode(request.form['password'].encode('ascii')).decode('ascii')

        if User.get_or_none(User.userName == userName) is not None:
            return render_template('SignUp.html', fullName=fullName, userName=userName, error='User with same username already exists!')

        User.create(userName = userName, fullName = fullName, encryptedPassword = encryptedPassword)
        login_user(UserMIXIN(userName))

        return redirect('/')

    return render_template('SignUp.html')

@app.route('/')
@login_required
def home():
    user = User.get_or_none(User.userName == current_user.id)
    if user is None:
        return redirect('/logout')
    return render_template('Home.html', user=user, dairies=loadDairiesForHomePage(user))

@app.route('/change-password', methods=['POST'])
@login_required
def changePassword():
    data = json.loads(request.get_data(as_text=True))
    encryptedPassword = base64.b64encode(data['oldPassword'].encode('ascii')).decode('ascii')

    user = User.get_or_none(User.userName == current_user.id, User.encryptedPassword == encryptedPassword)

    if user is None:
        return "Incorrect old password!", 400

    user.encryptedPassword = base64.b64encode(data['newPassword'].encode('ascii')).decode('ascii')
    user.save()

    return "Password updated successfully!"

@app.route('/upload-profile-pic', methods=['POST'])
@login_required
def uploadProfilePic():
    image = request.files['file'].read()
    user = User.get(User.userName == current_user.id)

    user.profilePic = 'data:image/pn;base64,{}'.format(base64.b64encode(image).decode())
    user.save()

    return str(user.profilePic)

@app.route('/delete-profile-pic')
@login_required
def deleteProfilePic():
    user = User.get(User.userName == current_user.id)
    user.profilePic = None
    user.save()
    return "Deleted successfully!"


@app.route('/save-user-info', methods=['PUT'])
@login_required
def saveProfileInfo():
    newUserInfo = json.loads(request.get_data(as_text=True))
    newUserInfo['userName] = newUserInfo['userName'].lower()
    if newUserInfo['userName'] != current_user.id and User.get_or_none(User.userName == newUserInfo['userName']):
        return 'User already exists with same username. Please try something else!', 400

    userInfo = User.get_or_none(User.userName == current_user.id)

    if userInfo is None:
        return redirect('/logout')

    if userInfo.userName != newUserInfo['userName']:
        userInfo.userName       = newUserInfo['userName']
        logout_user()
        login_user(UserMIXIN(userInfo.userName))
    if userInfo.fullName != newUserInfo['fullName']:
        userInfo.fullName = newUserInfo['fullName']
    if userInfo.dateOfBirth != newUserInfo['dob']:
        userInfo.dateOfBirth = newUserInfo['dob']
    if userInfo.aboutMe != newUserInfo['aboutMe']:
        userInfo.aboutMe = newUserInfo['aboutMe']
    if newUserInfo['email'] != 'None' and userInfo.email != newUserInfo['email']:
        userInfo.email = newUserInfo['email']
    if newUserInfo['mobile'] != 'None' and userInfo.email != newUserInfo['mobile']:
        userInfo.mobile = newUserInfo['mobile']

    userInfo.save()

    return "Profile information updated successfully!"

""" User Endpoints | END """

""" Dairy Endpoints | START """

def loadDairiesForHomePage(user):
    _allDates = \
        Dairy\
            .select(Dairy.postedOnDate)\
            .order_by(-Dairy.postedOnDate)\
            .where(Dairy.user == user)\
            .distinct()
    allDates = [str(_date.postedOnDate) for _date in _allDates]

    last3DaysDairies = {}
    for _date in allDates[:3]:
        if not _date in last3DaysDairies:
            last3DaysDairies[_date] = []
        dairies = Dairy.select()\
            .where(Dairy.user == user, Dairy.postedOnDate == _date)\
            .order_by(-Dairy.postedOnTime).limit(10)
        for dairy in dairies:
            last3DaysDairies[_date].append({
                'userName'      : dairy.user.userName,
                'postedOnDate'  : dairy.postedOnDate,
                'postedOnTime'  : str(dairy.postedOnTime).split('.')[0],
                'postedAt'      : dairy.postedAt,
                'subject'       : dairy.subject,
                'text'          : dairy.text,
                'picture'       : dairy.picture
            })
    return {'allDates' : allDates, 'last3DaysDairies' : last3DaysDairies}

@app.route('/post-dairy', methods = ['POST'])
@login_required
def postDairy():
    data = json.loads(request.get_data(as_text = True))

    dairy = Dairy.create(
        user            = User.get(User.userName == current_user.id),
        subject         = data['subject'],
        text            = data['text'],
        postedOnDate    = datetime.datetime.now().date(),
        postedOnTime    = datetime.datetime.now().time())

    return json.dumps({
        'userName'      : dairy.user.userName,
        'postedOnDate'  : dairy.postedOnDate,
        'postedOnTime'  : str(dairy.postedOnTime).split('.')[0],
        'postedAt'      : dairy.postedAt,
        'subject'       : dairy.subject,
        'text'          : dairy.text,
        'picture'       : dairy.picture
    }, default=str)

def toDate(dateString): 
    return datetime.datetime.strptime(dateString, "%Y-%m-%d").date()

@app.route('/dairies')
@login_required
def dairies():
    date = request.args.get('date', None, toDate)

    dairies = \
        Dairy\
            .select()\
            .where(\
                Dairy.user == User.get(User.userName == current_user.id),\
                Dairy.postedOnDate == date
            )\
            .order_by(-Dairy.postedOnTime)

    _records = []
    for dairy in dairies:
        _records.append({
            'id'            : dairy.id,
            'userName'      : dairy.user.userName,
            'postedOnDate'  : dairy.postedOnDate,
            'postedOnTime'  : str(dairy.postedOnTime).split('.')[0],
            'postedAt'      : dairy.postedAt,
            'subject'       : dairy.subject,
            'text'          : dairy.text,
            'picture'       : dairy.picture
        })

    return json.dumps(_records, default=str)    

""" Dairy Endpoints | END """

""" DB Layer | START """
from peewee import SqliteDatabase, Model, CharField, TextField, BlobField, ForeignKeyField, DateField, TimeField

db = SqliteDatabase('daily-daity-test.db')

class BaseModel(Model):
    class Meta:
        database = db

class User(BaseModel):
    userName            = CharField(column_name = 'userName', unique=True)
    encryptedPassword   = CharField(column_name = 'encryptedPassword')
    fullName            = CharField(column_name = 'fullName')
    dateOfBirth         = CharField(column_name = 'dateOfBirth', null = True)
    aboutMe             = TextField(column_name = 'aboutMe', null = True)
    email               = CharField(column_name = 'email', null = True)
    mobile              = CharField(column_name = 'mobile', null = True)
    profilePic          = TextField(column_name = 'profilePic', null = True)

class Dairy(BaseModel):
    user                = ForeignKeyField(User, backref='dairies')
    postedOnDate        = DateField(column_name='postedOnDate')
    postedOnTime        = TimeField(column_name='postedOnTime', formats='%H:%M:%S')
    postedAt            = CharField(column_name='postedAt', null = True)
    text                = TextField(column_name='text', null = True)
    subject             = CharField(column_name='subject', null = True)
    picture             = BlobField(column_name='picture', null = True)

db.connect()
db.create_tables([User, Dairy])

""" DB Layer | END """

app.debug = True
app.secret_key = 'secret'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
