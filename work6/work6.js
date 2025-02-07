const RB=ReactBootstrap;
const {Alert, Card, Button, Table} = ReactBootstrap;
const firebaseConfig = {
  apiKey: "AIzaSyDrjydWmT19vEJu6zvsJCZk-iLg5P9G_9c",
  authDomain: "web2567teungteung.firebaseapp.com",
  projectId: "web2567teungteung",
  storageBucket: "web2567teungteung.firebasestorage.app",
  messagingSenderId: "472898800755",
  appId: "1:472898800755:web:b861572160a6ca34a4ae06",
  measurementId: "G-LVKQEQ5Z67"
};

  firebase.initializeApp(firebaseConfig);      
const db = firebase.firestore();
const auth = firebase.auth();
db.collection("students").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`,doc.data());
  });
});

class App extends React.Component {
    title = (
      <Alert variant="info">
        <b>Work6 :</b> Firebase
      </Alert>
    );
    footer = (
      <div>
        By xxxxxxxxxx-x xxxxxxxxxxxxx xxxxxxxxxxxxxx <br />
        College of Computing, Khon Kaen University
      </div>
    );
    state = {
        scene: 0,
        students: [],
        user : null,
        stdId: "",
        stdTitle: "",
        stdFname: "",
        stdLname: "",
        stdEmail: "",
        stdPhone: "",
    }  

    constructor(){
      super();
      auth.onAuthStateChanged((user)=>{
          if (user) {
            this.setState({user:user.toJSON()});
          }else{
            this.setState({user:null});
         }
      });    
  }


  google_login() {
      // Using a popup.
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      firebase.auth().signInWithPopup(provider);
  }


  google_logout(){
      if(confirm("Are you sure?")){
        firebase.auth().signOut();
      }
  }


   
    edit(std){      
      this.setState({
       stdid    : std.id,
       stdtitle : std.title,
       stdfname : std.fname,
       stdlname : std.lname,
       stdemail : std.email,
       stdphone : std.phone,
      })
   }

    
    render() {
      var stext = JSON.stringify(this.state.students);
      return (
        <Card>
          <Card.Header>{this.title}</Card.Header>  
          <LoginBox user={this.state.user} app={this}></LoginBox>
          <Card.Body>
            <Button onClick={()=>this.readData()}>Read Data</Button>
            <Button onClick={()=>this.autoRead()}>Auto Read</Button>
            <div>
              <StudentTable data = {this.state.students} app={this}/>
            </div>
          </Card.Body>
          <Card.Footer>

              <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b><br/>
              <TextInput label="ID" app={this} value="stdid" style={{width:120}}/>
              <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{width:100}}/>
              <TextInput label="ชื่อ" app={this} value="stdfname" style={{width:120}}/>
              <TextInput label="นามสกุล" app={this} value="stdlname" style={{width:120}}/>
              <TextInput label="Email" app={this} value="stdemail" style={{width:150}}/>
              <TextInput label="Phone" app={this} value="stdphone" style={{width: 120}}/>

              <Button onClick={() => this.insertData()}>Save</Button>
          </Card.Footer>
          <Card.Footer>{this.footer}</Card.Footer>
        </Card>          
      );
    }      

    autoRead(){
      db.collection("students").onSnapshot((querySnapshot) => {
        var stdlist = [];
        querySnapshot.forEach((doc) => {
            stdlist.push({id:doc.id,... doc.data()});
        });
        this.setState({students:stdlist});
      });
    }

    insertData(){
      db.collection("students").doc(this.state.stdid).set({
        title: this.state.stdtitle,
        fname: this.state.stdfname,
        lname: this.state.stdlname,
        email: this.state.stdemail,
        phone: this.state.stdphone
      })
  }

    delete(std){
      if(confirm("ต้องการลบข้อมูล")){
        db.collection("students").doc(std.id).delete();
        this.autoRead();
      }
    }
}

function StudentTable({ data, app }){
  var rows = [];
  for(var s of data) {
    rows.push(<tr>
        <td>{s.id}</td>
        <td>{s.title}</td>
        <td>{s.fname}</td>
        <td>{s.lname}</td>
        <td>{s.email}</td>
        <td>{s.phone}</td>
        <td><EditButton std={s} app={app}/></td>
        <td><DeleteButton std={s} app={app}/></td>
      </tr>);
  }

  return <table className='table'>
  <tr>
        <td>รหัส</td>
        <td>คำนำหน้า</td>
        <td>ชื่อ</td>
        <td>สกุล</td>
        <td>email</td>
      </tr>
      { rows }
    </table>
}

function TextInput({label,app,value,style}){
return <label className = "form-label">
{label}:
<input className="form-control" style = {style}
value={app.state[value]} onChange={(ev)=>{
  var s = {};
  s[value] = ev.target.value;
  app.setState(s);}
}></input>
</label>;
}

function EditButton({std,app}){
  return <Button onClick={()=>app.edit(std)}>แก้ไข</Button>;
}

function DeleteButton({std,app}){
  return <Button onClick={()=>app.delete(std)}>ลบ</Button>;
}

function LoginBox(props) {
  const u = props.user;
  const app = props.app;
  if (!u) {
      return <div><Button onClick={() => app.google_login()}>Login</Button></div>
  } else {
      return <div>
          <img src={u.photoURL} />
          {u.email}<Button onClick={() => app.google_logout()}>Logout</Button></div>
  }
}

  const container = document.getElementById("myapp");
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
  