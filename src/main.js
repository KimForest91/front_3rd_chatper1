import Router from "./js/router.js";
import UserPreferences from "./js/userInfo.js";



const router = new Router();

// HTML 파일을 비동기로 불러오는 함수
function loadHTML(filePath) {
  return fetch(filePath).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  });
}

// main 페이지 로드 함수
function loadMainPage() {
  loadHTML("./templates/main.html")
    .then((html) => {
      document.querySelector("#root").innerHTML = html;
      setNavEvent();
      delUserProfile();
    })
    .catch((error) => {
      console.error("Error loading main page:", error);
    });
}

// login 페이지 로드 함수
function loadLoginPage() {
  loadHTML("./templates/login.html")
    .then((html) => {
      document.querySelector("#root").innerHTML = html;
      setUserProfile()
    })
    .catch((error) => {
      console.error("Error loading login page:", error);
    });
}

// profile 페이지 로드 함수
function loadProfilePage() {
  if(isLoggedIn()) {
    router.navigateTo("/login");
    return; 
  }

  // 로그인 상태인 경우 프로필 페이지 로드
  loadHTML("./templates/profile.html")
    .then((html) => {
      document.querySelector("#root").innerHTML = html;
      getUserProfile(); // 프로필 정보 가져오기
      setNavEvent();
      setUserProfile();
      delUserProfile();

    })
    .catch((error) => {
      console.error("Error loading profile page:", error);
    });
}

//  error 페이지 로드 함수
function loadErrorPage() {
  loadHTML("./templates/error.html")
    .then((html) => {
      document.querySelector("#root").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error loading error page:", error);
    });
}

// Router 설정
router.addRoute("/", loadMainPage);
router.addRoute("/login", loadLoginPage);
router.addRoute("/profile", loadProfilePage);
router.addRoute("404", loadErrorPage);

// 초기 로드 처리
router.handleRoute(window.location.pathname);

// 내비게이션 이벤트 처리
function setNavEvent() {
  document.querySelector("nav").addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      router.navigateTo(e.target.getAttribute("href"));
    }
  });
}


// 프로필 저장이벤트
function setUserProfile() {
  document.querySelector(".saveUserProfile").addEventListener("submit", (e) => {
    // e.preventDefault(); 
    console.log("profileForm===========", e.target);
    
    const profileForm = document.getElementById("profileForm");
    const loginForm = document.getElementById("loginForm");
    console.log("profileForm===========", profileForm);
    console.log("loginForm===========", loginForm);
    
    // 폼 제출 기본 동작 방지

    const prefs = new UserPreferences();


    if(profileForm) {
      // 입력값 가져오기
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const bio = document.getElementById("bio").value;

      // console.log("username===========", username);
      // console.log("email===========", email);
      // console.log("bio===========", bio);

      // 로컬 스토리지에 저장

      prefs.set("username", username);
      prefs.set("email", email);
      prefs.set("bio", bio);


      // 저장 완료 메시지 표시
      alert("프로필이 저장되었습니다!");

    } else if (loginForm) {
      // 입력값 가져오기
      const userId = document.getElementById("userId").value;
      const password = document.getElementById("password").value;

      if(isValidEmail(userId) || isValidPhoneNumber(userId)) {
        // 로컬 스토리지에 저장
        prefs.set("userId", userId);
        prefs.set("password", password);
        
        router.navigateTo("/");
      } else {
        alert("이메일 또는 전화번호 형식이 아닙니다.");
      }
    }
  });
}

// 이메일 형식 검증
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// 전화번호 형식 검증
function isValidPhoneNumber(phone) {
  const phonePattern = /^\d{2,3}-\d{3,4}-\d{4}$/; // 예: 010-1234-5678
  return phonePattern.test(phone);
}

// 프로필 삭제이벤트
function delUserProfile() {
  document.querySelector(".delUserProfile").addEventListener("click", (e) => {
    const prefs = new UserPreferences();
    prefs.clear();
    router.navigateTo("/login");
    alert("프로필이 삭제되었습니다!");
  });
}

function getUserProfile() {
  const prefs = new UserPreferences();
  const userName = prefs.get("username");
  const email = prefs.get("email");
  const bio = prefs.get("bio");

  if(userName) {
    document.querySelector("#username").value = userName;
    document.querySelector("#email").value = email;
    document.querySelector("#bio").value = bio;
  } else {
    document.querySelector("#username").value = "홍길동";
    document.querySelector("#email").value = "hong@example.com";
    document.querySelector("#bio").value = "안녕하세요. 반갑습니다.";
  }


}


// 로그인여부 확인
function isLoggedIn() {
  // 예시: 로컬 스토리지에 저장된 사용자 ID가 있는지 확인
  return localStorage.getItem("userId") !== null;
}