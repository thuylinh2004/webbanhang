const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("messageDisplay");
const messageRegister = document.getElementById("messageRegisterDisplay");

loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;
    if(!loginEmail || !loginPassword){
        showMessage("Vui lòng nhập đầy đủ email password", "red");
        return;
    }
    try {
        const users = await fetch("https://67ffae04b72e9cfaf72583b0.mockapi.io/users");
        const convertUserData = await users.json();
        console.log(convertUserData);
        const user = convertUserData.find(user => user.email === loginEmail && user.password === loginPassword);
    if(!user){
        showMessage("Tài khoản hoặc mật khẩu sai", "red");
        return;
    }
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    }
    localStorage.setItem("userData", JSON.stringify(userData));
    showMessage("Login successful", "green");
    window.location.href = "index.html";
    } catch (error) {
        console.error(error);
        showMessage("Error 500", "red");
    }
})

const registerBtn = document.getElementById("registerBtn");
const createdAt = new Date();
registerBtn.addEventListener("click", async function (e) {
    e.preventDefault();
    console.log("register")
    const registerUsername = document.getElementById("registerUsername").value;
    console.log(registerUsername);
    const registerEmail = document.getElementById("registerEmail").value;
    const registerPassword = document.getElementById("registerPassword").value;
    if(!registerUsername || !registerEmail || !registerPassword){
        showMessageRegister("Vui lòng nhập đầy đủ thông tin", "red");
        console.log("Vui lòng nhập đầy đủ thông tin");
        return;
    }
    if(registerPassword.length < 6){
        showMessageRegister("Mật khẩu phải dài hơn 6 ký tự", "red");
        console.log("Mật khẩu phải dài hơn 6 ký tự");
        return
    }
    console.log(registerEmail);
    try {
        const response = await axios.get("https://67ffae04b72e9cfaf72583b0.mockapi.io/users");
        const user = response.data;
        const checkUser = user.find(u => u.email === registerEmail);
        if(checkUser){
            showMessageRegister("Email đã tồn tại", "red");
            console.log("Email đã tồn tại");
            return;
        }
    
        await axios.post("https://67ffae04b72e9cfaf72583b0.mockapi.io/users", {
            name: registerUsername,
            email: registerEmail,
            password: registerPassword,
            createdAt: createdAt,
        })
        showMessageRegister("Đăng ký thành công", "green");
    } catch (error) {
        showMessageRegister("Đăng ký thất bại", "red");
    }
})

function showMessage(content, color){
    message.style.color = color;
    message.textContent = content;
}
function showMessageRegister(content, color){
    messageRegister.style.color = color;
    messageRegister.textContent = content;
}
function switchToTab(tabId) {
  document.getElementById(tabId).click();
}