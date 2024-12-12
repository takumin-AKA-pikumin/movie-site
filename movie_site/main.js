"use strict"

//共通アイテム
const container = document.getElementById("app");
const popup = document.getElementById("popup-inside");
const popupWrapper = document.getElementById('popup-wrapper');
const serchMovie = document.getElementById("serchMovie");
const popup_title = document.getElementById("popup_title");
const popup_releaseDate = document.getElementById("popup_releaseDate");
const popup_review = document.getElementById("popup_review");
const popup_overview = document.getElementById("popup_overview");
const popup_comment = document.getElementById("popup_comment");
const popup_poster = document.getElementById("popup_poster");
const pathname = window.location.pathname.split("/").pop();
let original_title = "";
let popupComments = []; //コメントをオブジェクトで管理
let favoriteMovies = []; //コメントをオブジェクトで管理
let localStorageComments = [];
let localStoragefavoriteMovies = [];
const api_key = "fbb4324301c3b8ca48239c9904c483a6";
let Movies = [];
const sortUpDate = document.getElementById("sortUpDate");
const sortDownDate = document.getElementById("sortDownDate");
const sortName = document.getElementById("sortName");
const deleteHistory = document.getElementById("deleteHistory");
const favoriteMovie = document.getElementById("favoriteMovie");
const commentAndFavorite = document.getElementById("commentAndFavorite");
const commentMovies = document.getElementById("commentMovies");
const favoriteMovies2 = document.getElementById("favoriteMovies2");
let userInformation;

//ヘッダー取得
async function loadHeader() {
  try {
    const response = await fetch("header.html");
    const data = await response.text();
    document.querySelector("#header").innerHTML = data;
  } catch (error) {
    console.error("Error loading header:", error);
  }
}

//ポップアップ
const showPopup = (title, releaseDate, voteAverage, originalTitle, overview, imgPath) => {
  favoriteMovie.innerHTML = "いいねする";
  favoriteMovies.forEach(Movie => {
    if (Movie.title === title) {
      favoriteMovie.innerHTML = "いいねを外す";
    }
  });
  popup_poster.src = imgPath !== null ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${imgPath}` : "./noimage.png";
  popup_poster.alt = title.textContent;

  original_title = originalTitle;
  popupWrapper.style.display = "block";
  serchMovie.href = `https://www.google.com/search?q=${title}`;
  popup_title.textContent = title;
  popup_releaseDate.textContent = releaseDate;
  popup_review.textContent = `${voteAverage}/10`;
  popup_overview.textContent = overview === "" ? "まだ概要がありません。" : overview;
  popup_comment.value = "";
  popupComments.forEach(popupComment => {
    if (popupComment.title === original_title) {
      popup_comment.value = popupComment.comment;
    }
  });
};

//共通処理
if (pathname === "index.html" || pathname === "calendar.html" || pathname === "mypage.html") {
  loadHeader();
  //コメント
  localStorageComments = localStorage.getItem("popupComments");
  if (localStorageComments) {
    console.log("popupComments", JSON.parse(localStorageComments));  // 取得した値を確認
    popupComments = JSON.parse(localStorageComments);
  }

  //お気に入り
  localStoragefavoriteMovies = localStorage.getItem("favoriteMovies");
  if (localStoragefavoriteMovies) {
    console.log("favoriteMovies", JSON.parse(localStoragefavoriteMovies));  // 取得した値を確認
    favoriteMovies = JSON.parse(localStoragefavoriteMovies);
  }

  // ポップアップの外側又は「x」のマークをクリックしたときポップアップを閉じる
  const close = document.getElementById('close');
  popupWrapper.addEventListener('click', e => {
    if (e.target.id === popupWrapper.id || e.target.id === close.id || e.target.id === sendBtn.id) {
      popupWrapper.style.display = 'none';
    }
  });

  //ポップアップ送信ボタン押下時
  const sendBtn = document.getElementById('sendBtn');
  sendBtn.addEventListener("click", e => {
    if (popup_comment.value === "") {
      alert("コメントをしてください。");
      return;
    }

    const existMovie = popupComments.findIndex(item => item.title === popup_title.textContent);// 映画タイトルで既存のコメントを検索
    if (existMovie !== -1) {
      // 既に存在する場合、コメントを更新
      popupComments[existMovie].comment = popup_comment.value;
      alert("コメントを更新しました。");
    } else {
      // 存在しない場合、新しい映画データを追加
      popupComments.push(createMovieData());
      alert("送信しました。");
    }
    popupComments = popupComments.filter(function (item) {
      return item.comment !== "";
    });
    localStorage.setItem("popupComments", JSON.stringify(popupComments));
  })

  //いいね
  favoriteMovie.addEventListener("click", e => {
    const title = popup_title.textContent;
    if (favoriteMovie.innerHTML === "いいねする") {
      alert(`「${title}」がいいね👍されました！`);
      favoriteMovies.push(createMovieData());
      favoriteMovie.innerHTML = "いいねを外す";
    } else {
      favoriteMovies = favoriteMovies.filter(function (item) {
        return item.title !== title;
      });
      alert(`「${title}」のいいねが外されましたTT`);
      favoriteMovie.innerHTML = "いいねする";
    }
    localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
  })

  //ローカルストレージ保存用
  function createMovieData() {
    return {
      title: popup_title.textContent,
      poster_path: popup_poster.src,
      release_date: popup_releaseDate.textContent,
      vote_average: popup_review.textContent,
      original_title: popup_title.textContent,
      overview: popup_overview.textContent,
      comment: popup_comment.value
    };
  }
}

//映画表示
const createItem = (titleName, imgPath, releaseDate, voteAverage, originalTitle, overview) => {
  const row = document.createElement("div");
  row.setAttribute("class", "item");

  //タイトル
  const title = document.createElement("a");
  title.setAttribute("class", "title");
  title.setAttribute("id", "title");
  title.textContent = titleName;

  //ポップアップ表示
  title.addEventListener('click', function () {
    showPopup(title.textContent, releaseDate, voteAverage, originalTitle, overview, imgPath);
  });

  //公開日
  const date = document.createElement("p");
  date.setAttribute("class", "date");
  date.textContent = "公開日　: " + releaseDate;

  //ポスター
  const poster = document.createElement("img");
  poster.src = imgPath !== null ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${imgPath}` : "./noimage.png";
  poster.alt = title.textContent

  //ポップアップ表示
  poster.addEventListener('click', function () {
    showPopup(title.textContent, releaseDate, voteAverage, originalTitle, overview, imgPath);
  });

  //行追加
  container.appendChild(row);
  row.appendChild(poster);
  row.appendChild(date);
  row.appendChild(title);
};

// containerの中身をクリアする
function resetContainer() {
  container.innerHTML = "";
}

//一覧ページ
if (pathname === "index.html") {
  initialInfo();

  let user = document.getElementById("user");
  userInformation = JSON.parse(localStorage.getItem("userInformation"));
  if (userInformation) {
    console.log("userInformation", userInformation);
    user.innerHTML = `${userInformation.menberName}さん、お帰りなさい。`;
  } else {
    user.innerHTML = "ゲストログイン中";
  }
  //検索用
  const text_form = document.getElementById("text_form");
  text_form.addEventListener("keydown", test_event);

  function test_event(e) {
    if (e.key === "Enter" && text_form.value != "") {
      getSearch(text_form.value);
    }
    return false;
  }

  function sortMovies(className) {
    resetContainer();
    Movies.sort((a, b) => {
      if (className === "sortUpDate") {
        return new Date(b.release_date) - new Date(a.release_date); // 新しい日付が上になるようにする
      } else if (className === "sortDownDate") {
        return new Date(a.release_date) - new Date(b.release_date); // 古い日付が上になるようにする
      } else {
        return a.title.localeCompare(b.title, 'ja'); // 'ja'で日本語ロケールに従ってソート
      }
    });

    Movies.forEach((movie) => {
      createItem(
        movie.title, 
        movie.poster_path, 
        movie.release_date, 
        movie.vote_average, 
        movie.original_title, 
        movie.overview
      );
    });
  };

  //↑上映順でソート
  sortUpDate.addEventListener('click', function () {
    sortMovies(sortUpDate.className);
  });

  //↓上映順でソート
  sortDownDate.addEventListener('click', function () {
    sortMovies(sortDownDate.className);
  });

  //名前順でソート
  sortName.addEventListener('click', function () {
    sortMovies(sortName.className);
  });

  //履歴削除
  deleteHistory.addEventListener("click", e => {
    if (confirm("いいねやコメントした履歴を削除しますか？")) {
      localStorage.removeItem("popupComments");
      localStorage.setItem("popupComments", []);
      localStorage.removeItem("favoriteMovies");
      localStorage.setItem("favoriteMovies", []);
    }
  })
}

//MYPAGE
if (pathname === "mypage.html") {
  resetContainer();
  initialMypage();

  commentAndFavorite.addEventListener("click", e => {
    resetContainer();
    initialMypage();
  })

  commentMovies.addEventListener("click", e => {
    resetContainer();
    createMypageText("コメントした映画");
    myMovies(popupComments);
  })

  favoriteMovies2.addEventListener("click", e => {
    resetContainer();
    createMypageText("いいねした映画");
    myMovies(favoriteMovies);
  })
}

//Mypage初期表示
function initialMypage() {
  createMypageText("コメントした映画");
  myMovies(popupComments);
  createMypageText("いいねした映画");
  myMovies(favoriteMovies);
}

function myMovies(Movies) {
  Movies.forEach((movie) => {
    createItem(
      movie.title,
      movie.poster_path, 
      movie.release_date, 
      movie.vote_average, 
      movie.original_title, 
      movie.overview
    );
  });
}

function createMypageText(text) {
  const row = document.createElement("div");
  row.setAttribute("class", "mypageText");
  const title = document.createElement("a");
  title.textContent = text;
  container.appendChild(row);
  row.appendChild(title);
}

async function initialInfo(pattern = "") {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}&language=ja&region=US&page=1`
    );
    const data = await response.json();
    Movies = data.results;

    if (pattern === "") {
      Movies.forEach((movie) => {
        createItem(
          movie.title,
          movie.poster_path,
          movie.release_date,
          movie.vote_average,
          movie.original_title,
          movie.overview
        );
      });
    }
  } catch (error) {
    console.log("error", error);
  }
}

//検索
function getSearch(query) {
  resetContainer();
  if (query == "") {
    initialInfo();
  } else {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=ja&query=${query}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        Movies = data.results;
        Movies.map((movie) => {
          createItem(
            movie.title, 
            movie.poster_path, 
            movie.release_date, 
            movie.vote_average, 
            movie.original_title, 
            movie.overview
          );
        });
      })
      .catch((error) => {
        console.log("error");
      });
  }
}

//カレンダー
if (pathname === "calendar.html") {
  (async () => {
    // 非同期で Movies を取得し、結果を待つ
    await initialInfo("pattern");

    const date = new Date();
    const today = date.getDate();
    const currentYear = date.getFullYear();
    let currentMonth = date.getMonth();
    const todayMonth = date.getMonth();

    function anotherMonth(currentYear, currentMonth) {
      document.getElementById('calendarHeader').textContent = `${currentYear}年${currentMonth + 1}月`;
      document.getElementById('calendar').innerHTML = createCalendar(currentMonth);
    };

    function createCalendar(month) {
      const monthDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let calendarHTML = '<table class="calendar"><thead><tr>';

      //ヘッダー作成
      for (let i = 0; i < 7; i++) {
        if (i === 0) {
          calendarHTML += `<th class="sun">${monthDays[i]}</th>`;
        } else if (i === 6) {
          calendarHTML += `<th class="sat">${monthDays[i]}</th>`;
        } else {
          calendarHTML += `<th class="weekdays">${monthDays[i]}</th>`;
        }
      }

      calendarHTML += '</tr></thead><tbody>';

      const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate(); //今月の最終日（月の日数）
      const firstDay = new Date(date.getFullYear(), month, 1).getDay();  //今月一日の曜日(0：日曜日～6：土曜日)

      const daysInPrevMonth = new Date(date.getFullYear(), month, 0).getDate(); //先月の最終日（月の日数）

      let dayCount = 1;
      let prevDayCount = daysInPrevMonth - firstDay + 1;
      for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';

        for (let j = 0; j < 7; j++) {
          if (i === 0 && j < firstDay) { //先月
            calendarHTML += `<td class="mute">${prevDayCount}</td>`;
            prevDayCount++;
          } else if (dayCount > daysInMonth) { //来月
            let nextMonthDayCount = dayCount - daysInMonth;
            calendarHTML += `<td class="mute">${nextMonthDayCount}</td>`;
            dayCount++;
          } else { //今月
            if (dayCount === today && month === todayMonth) { // 今日の日付にclassを付ける
              const dayMoviesHTML = returnDayMovies(currentYear, currentMonth + 1, dayCount);
              calendarHTML += `<td class="today">${dayCount}${dayMoviesHTML}</td>`;
            }
            // 月曜日にclassを付ける
            // else if (j === 1) {
            //     calendarHTML += `<td class="off">${dayCount}</td>`;
            // } 
            else {
              const dayMoviesHTML = returnDayMovies(currentYear, currentMonth + 1, dayCount);
              calendarHTML += `<td>${dayCount}${dayMoviesHTML}</td>`;
            }
            dayCount++;
          }
        }

        calendarHTML += '</tr>';

        if (dayCount - daysInMonth > 7) {
          break;
        }
      }

      calendarHTML += '</tbody></table>';

      return calendarHTML;
    }

    anotherMonth(currentYear, currentMonth);

    //先月を表示
    document.getElementById('lastMonth').addEventListener('click', e => {
      currentMonth -= 1;
      anotherMonth(currentYear, currentMonth);
    })

    //来月を表示
    document.getElementById('nextMonth').addEventListener('click', e => {
      currentMonth += 1;
      anotherMonth(currentYear, currentMonth);
    })
  })();
}

//上映日の映画返却
function returnDayMovies(currentYear, currentMonth, dayCount) {
  // 映画のリリース日がこの日に該当するものを抽出
  let dayMovies = Movies.filter(movie => {
    // 日付が"YYYY-MM-DD"形式なので、それを分割して確認
    let [releaseYear, releaseMonth, releaseDay] = movie.release_date.split("-");
    return (
      parseInt(releaseYear) === currentYear &&
      parseInt(releaseMonth) === (currentMonth) &&
      parseInt(releaseDay) === dayCount
    );
  });

  // 該当する映画がある場合、タイトルを改行で表示
  let dayMoviesHTML = dayMovies.map(movie =>
    `<br><a href="javascript:showPopup('${movie.title}','${movie.release_date}','${movie.vote_average}','${movie.original_title}','${movie.overview}','${movie.poster_path}')">${movie.title}</a>`
  ).join("");

  return dayMoviesHTML;
}

//設定
if (pathname === "setting.html") {
  loadHeader();
  const furigana = document.getElementById("furigana");//ふりがな
  const menberName = document.getElementById("menberName");//名前
  const gender = document.getElementById("gender");//性別
  const birthday = document.getElementById("birthday");//生年月日
  const clickSubmit = document.getElementById("submit");//送信
  let passwordInput = document.getElementById("password");//パスワード

  userInformation = JSON.parse(localStorage.getItem("userInformation"));
  if (userInformation) {
    console.log("userInformation", userInformation);
    furigana.value = userInformation.furigana;
    menberName.value = userInformation.menberName;
    gender.value = userInformation.gender;
    birthday.value = userInformation.birthday;
    password.value = userInformation.password;
  }

  //サインアウト
  document.getElementById("signOut").addEventListener("click", function () {
    if (confirm("本当にサインアウトしますか？")) {
      localStorage.removeItem("userInformation");
    } else {
      return;
    }
  })

  // パスワード
  document.querySelector(".toggle-password").addEventListener("click", function () {
    let passwordType = passwordInput.getAttribute("type");
    if (passwordType === "password") {
      passwordInput.setAttribute("type", "text");
    } else {
      passwordInput.setAttribute("type", "password");
    }
  });

  // 送信
  clickSubmit.addEventListener("click", e => {
    // 入力値のチェック
    if (!furigana.value) {
      alert("ふりがなを入力してください。");
      return;
    }
    if (!menberName.value) {
      alert("名前を入力してください。");
      return;
    }
    if (!gender.value) {
      alert("性別の値を入力してください。");
      return;
    }
    if (!birthday.value) {
      alert("生年月日の値を入力してください。");
      return;
    }

    const passwordValue = password.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/; //英小文字・英大文字を含むかつ8文字以上
    if (!passwordValue) {
      alert("パスワードの値を入力してください。");
      return;
    }
    if (!passwordRegex.test(passwordValue)) {
      alert("パスワードは大文字と小文字を含み、8文字以上で入力してください。");
      e.preventDefault();
      return;
    }

    const maskPassword = "*".repeat(password.value.length);
    if (confirm(
      `下記の内容で登録してよろしいでしょうか？\r\n
      ふりがな：${furigana}\r\n
      名前：${menberName}\r\n
      性別：${gender.value}\r\n
      生年月日：${birthday.value}\r\n
      パスワード：${maskPassword}`
    )) {
      userInformation = {
        furigana: furigana.value,
        menberName: menberName.value,
        gender: gender.value,
        birthday: birthday.value,
        password: password.value
      };
      localStorage.setItem("userInformation", JSON.stringify(userInformation));
      alert("登録完了！")
    } else {
      return;
    }
  })
}
