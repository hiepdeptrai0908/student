import url from "../../url.js";
/* -------------------------------------------------------------------------------------------------------------------------------- */
// TRANG ADMIN
window.addEventListener("load", function () {
    const elements = {
        wrapper: document.querySelector(".wrapper"),
        mobileOption: document.querySelector(".form-select-mobile"),
        windowOption: document.querySelector(".form-select-window"),
        contentElements: document.querySelector(".contents"),
        managerOption: document.getElementById("manager-option"),
        managerCoreTable: document.querySelector(".manager-core-table"),
        managerClass: document.querySelector(".manager-class"),
        managerStudent: document.querySelector(".manager-student"),
        managerInsertCore: document.querySelector(".manager-insert-core"),
        managerFiles: document.querySelector(".manager-files"),
        managerClassLogBook: document.querySelector(".manager-class-log-book"),
        managerRank: document.querySelector(".manager-rank"),
        studentCountElement: document.getElementById("student-count"),
        lessonSelectElement: document.getElementById("lesson-select"),
        classnameInputElement: document.getElementById("classname-input"),
        scoreCreatedAtElement: document.getElementById("score-created-at"),
        modalOverlay: document.querySelector(".modal-overlay"),
        modalOverlay: document.querySelector(".modal-overlay"),
        loginInput: document.querySelector(".modal-login-input"),
        loginBtn: document.querySelector(".btn-login"),
        imageNotFound: document.querySelector(".image-not-found"),
        oldClassDropdown: document.getElementById("old-class-dropdown"),
        deleteClassDropdown: document.getElementById("delete-class-dropdown"),
        oldStudentDropdown: document.getElementById("old-student-dropdown"),
        updateStudentDropdown: document.getElementById(
            "update-student-dropdown"
        ),
        deleteStudentDropdown: document.getElementById(
            "delete-student-dropdown"
        ),
        tableStudentDropdown: document.getElementById("table-student-dropdown"),
        insertScoreClassDropdown: document.getElementById(
            "insert-score__class-dropdown"
        ),
        deleteScoreClassDropdown: document.getElementById(
            "delete-score__class-dropdown"
        ),
        listStudentClassDropdown: document.getElementById(
            "list-student-select-class"
        ),
        deleteScoreLessonDropdown: document.getElementById(
            "delete-score__lesson-dropdown"
        ),
        deleteScoreLesson: document.getElementById("delete-score-lesson"),

        screenScoreClassDropdown: document.getElementById(
            "screen-score__class-dropdown"
        ),
        screenScoreLessonDropdown: document.getElementById(
            "screen-score__lesson-dropdown"
        ),
        logBookWriteDropdown: document.getElementById(
            "log-book-write__lesson-dropdown"
        ),
        updateScoreLessonDropdown: document.getElementById("lesson"),
        showMaxScoreUpdate: document.getElementById("show-max-score__update"),
        showMaxScoreStudent: document.getElementById("show-max-score__student"),
        showMaxScoreTable: document.getElementById("show-max-score__table"),
        ///// Class Log Book //////////
        logBookOption: document.querySelector(".log-book-option"),
        logBookOptionBtns: document.querySelectorAll(".log-book-option-btn"),
        logBookToday: document.querySelector(".log-book-today"),
        logBookSearch: document.querySelector(".log-book-search"),
        logBookWrite: document.querySelector(".log-book-write"),
        // Search Log Book //////////////////
        logBookSearchClassDropdown: document.querySelector(
            "#log-book-search__class-dropdown"
        ),
        logBookSearchForm: document.querySelector("#log-book-search-form"),

        // RANK //////////////////////////////////////////////////////////////////
        rankSelectClass: document.querySelector("#rank-select-class"),
    };
    let students = []; // Lưu trữ tất cả học sinh đã tải về
    let listFilteredStudentsByClassId = [];

    const tableWrapper = document.querySelector("table");

    const timeOut = 0;
    const doneTypingInterval = 400;
    // Hàm hiện modal loading
    function showLoadingModal() {
        const loadingModal = document.getElementById("loadingModal");
        loadingModal.style.display = "flex";
    }

    // Hàm để ẩn modal loading
    function hideLoadingModal() {
        const loadingModal = document.getElementById("loadingModal");
        loadingModal.style.display = "none";
    }
    // Hàm để hiển thị hoặc ẩn các phần tử
    function toggleVisibility(elementsToShow, elementsToHide) {
        elementsToShow.forEach((el) => el.removeAttribute("hidden"));
        elementsToHide.forEach((el) => el.setAttribute("hidden", true));
    }

    // Xử lý đăng nhập
    function handleLogin() {
        const loginInputValue = elements.loginBtn.value.trim().toUpperCase();

        if (loginInputValue === "HS") {
            elements.modalOverlay.style.display = "none";
            elements.contentElements.classList.add("centered");
            toggleVisibility(
                [elements.wrapper, elements.managerCoreTable],
                [
                    elements.mobileOption,
                    elements.windowOption,
                    elements.managerOption,
                    elements.managerClass,
                    elements.managerStudent,
                    elements.managerInsertCore,
                    elements.managerFiles,
                    elements.managerClassLogBook,
                    elements.managerRank,
                ]
            );
        } else if (["HIEP"].includes(loginInputValue)) {
            elements.modalOverlay.style.display = "none";
            toggleVisibility(
                [
                    elements.wrapper,
                    elements.managerOption,
                    elements.managerCoreTable,
                ],
                [
                    elements.managerClass,
                    elements.managerStudent,
                    elements.managerInsertCore,
                    elements.managerFiles,
                    elements.managerClassLogBook,
                    elements.managerRank,
                ]
            );
            optionScreen();
        } else {
            alert("Giá trị nhập không hợp lệ. Vui lòng thử lại.");
        }
    }

    // Xử lý thay đổi giá trị nhập trong ô đăng nhập
    function handleChangeLoginInput(event) {
        elements.loginBtn.value = event.target.value.trim().toUpperCase();
    }

    // Lấy giá trị từ localStorage và đặt trạng thái 'active' ban đầu
    const savedOptionValue =
        localStorage.getItem("manager-option-value") || "1";

    // Gọi optionScreen để hiển thị đúng nội dung dựa trên giá trị đã lưu
    optionScreen(savedOptionValue);

    // Đặt 'active' cho nút tương ứng với giá trị đã lưu
    document.querySelectorAll(".btn-option").forEach((button) => {
        const optionValue = button.getAttribute("data-value");
        if (optionValue === savedOptionValue) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    // Lắng nghe sự kiện nhấn nút cho phiên bản Windows
    document.querySelectorAll(".btn-option").forEach((button) => {
        button.addEventListener("click", function () {
            const optionValue = this.getAttribute("data-value");

            // Xóa class 'active' từ tất cả các nút
            document
                .querySelectorAll(".btn-option")
                .forEach((btn) => btn.classList.remove("active"));

            // Thêm class 'active' vào nút hiện tại
            this.classList.add("active");

            // Gọi hàm xử lý hiển thị và lưu lại lựa chọn
            optionScreen(optionValue);
            localStorage.setItem("manager-option-value", optionValue);
        });
    });

    // Xử lý màn hình tùy chọn quản lý
    async function optionScreen(
        optionValue = localStorage.getItem("manager-option-value") || "1"
    ) {
        if (optionValue === "7") {
            getAllStatistics();
        }

        if (optionValue === "6") {
            renderLogBook(
                elements.logBookToday,
                await fetchLogClassData({
                    date: getTodayDate(),
                    classId: null,
                    part: null,
                    teacher: null,
                })
            );
        }
        const optionMap = {
            1: [elements.managerCoreTable],
            2: [elements.managerClass],
            3: [elements.managerStudent],
            4: [elements.managerInsertCore],
            5: [elements.managerFiles],
            6: [elements.managerClassLogBook],
            7: [elements.managerRank],
        };

        elements.managerOption.value = optionValue;
        Object.keys(optionMap).forEach((key) => {
            if (key == optionValue) {
                toggleVisibility(
                    optionMap[key],
                    [
                        elements.managerCoreTable,
                        elements.managerClass,
                        elements.managerStudent,
                        elements.managerInsertCore,
                        elements.managerFiles,
                        elements.managerClassLogBook,
                        elements.managerRank,
                    ].filter((el) => !optionMap[key].includes(el))
                );
            }
        });
    }

    // Xử lý thay đổi lựa chọn của quản lý
    function handleManagerOptionChange(e) {
        const optionValue = e.target.value;
        optionScreen(optionValue);
        localStorage.setItem("manager-option-value", optionValue);
    }

    // Gán các sự kiện cho các phần tử
    elements.managerOption.addEventListener(
        "change",
        handleManagerOptionChange
    );
    elements.loginInput.addEventListener("change", handleChangeLoginInput);
    elements.loginInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            elements.loginBtn.value = event.target.value.trim().toUpperCase();
            event.preventDefault();
            elements.loginBtn.click();
        }
    });
    elements.loginBtn.addEventListener("click", handleLogin);

    // HIỂN THỊ LỚP HỌC
    function formatDateTime(dateString) {
        const date = new Date(dateString);

        // Mảng chứa các tên của các ngày trong tuần
        const daysOfWeek = [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
        ];

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const dayOfWeek = daysOfWeek[date.getDay()]; // Lấy tên ngày trong tuần từ mảng

        return `${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}`;
    }
    function formatShortDateTime(dateString) {
        const date = new Date(dateString);

        // Mảng chứa các tên của các ngày trong tuần
        const daysOfWeek = [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy",
        ];

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const dayOfWeek = daysOfWeek[date.getDay()]; // Lấy tên ngày trong tuần từ mảng

        return `${dayOfWeek}<span class="date-space-mobile" style="display:none"><br /></span> ${day} - ${month} - ${year}`;
    }

    // Format tên bài học
    function handleLessonName(lessonNumber) {
        if (lessonNumber < 100) {
            return `Từ Vựng Bài ${lessonNumber}`;
        } else if (lessonNumber >= 100 && lessonNumber < 200) {
            return `Ngữ Pháp Bài ${lessonNumber - 100}`;
        } else if (lessonNumber >= 200 && lessonNumber < 300) {
            return `Hán Tự Bài ${lessonNumber - 200}`;
        } else if (lessonNumber >= 300 && lessonNumber < 400) {
            return `2 Bài Minano Nihongo: Bài ${lessonNumber - 300 - 1} → Bài ${
                lessonNumber - 300
            }`;
        } else if (lessonNumber >= 400 && lessonNumber < 500) {
            return `5 Bài Minano Nihongo: Bài ${lessonNumber - 400 - 4} → Bài ${
                lessonNumber - 400
            }`;
        } else if (lessonNumber >= 500 && lessonNumber < 600) {
            return `5 Bài Look And Learn: Bài ${lessonNumber - 500 - 4} → Bài ${
                lessonNumber - 500
            }`;
        } else if (lessonNumber >= 600 && lessonNumber < 700) {
            return `JLPT Lần ${lessonNumber - 600}`;
        } else if (lessonNumber >= 700 && lessonNumber < 800) {
            return `Bài văn số ${lessonNumber - 700}`;
        }
    }

    // Xóa bảng cũ nếu có
    function handleClearTable() {
        if (tableWrapper) {
            const existingTables = tableWrapper.querySelectorAll("table");
            existingTables.forEach((element) => element.remove());
        }

        document
            .querySelectorAll(".rank-item-max span")
            .forEach((span) => span.remove());
        document
            .querySelectorAll(".rank-item-min span")
            .forEach((span) => span.remove());
        document
            .querySelectorAll(".rank-item-no-test span")
            .forEach((span) => span.remove());
    }

    async function showCoreTable(data) {
        handleClearTable();
        showLoadingModal();
        const response = await fetch(url + "score-lesson", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        // Dữ liệu trả về -> datas
        const datas = await response.json();
        setTimeout(() => {
            hideLoadingModal();
            const createdAt = datas[0]?.created_at;
            elements.scoreCreatedAtElement.textContent = createdAt
                ? formatDateTime(createdAt)
                : "Chưa có dữ liệu";
            elements.showMaxScoreTable.textContent = `${
                datas[0]?.max_score ? datas[0]?.max_score : "..."
            } đ`;

            // Lọc các điểm số không phải là 0
            const nonZeroScores = datas
                .filter((item) => item.score > 0)
                .map((item) => item.score);

            // Tìm điểm số nhỏ nhất và lớn nhất
            const minScore =
                nonZeroScores.length > 0 ? Math.min(...nonZeroScores) : 0;
            const maxScore =
                nonZeroScores.length > 0 ? Math.max(...nonZeroScores) : 0;

            // Tạo bảng mới
            const table = document.createElement("table");
            table.className = "table table-hover border";
            table.style.width = "100%";

            // Tạo hàng tiêu đề
            const thead = document.createElement("thead");
            thead.innerHTML = `
                <tr class="table-light">
                    <th width="40px">STT</th>
                    <th style="max-width: 250px;">Họ và Tên</th>
                    <th width="45px">Điểm</th>
                    <th width="45px">Sai</th>
                    <th>Chú thích</th>
                </tr>
            `;
            table.appendChild(thead);

            // Tạo phần thân bảng
            const tbody = document.createElement("tbody");
            let totalWrong = 0;
            let totalCompletedTests = 0; // Tổng số bài làm khác 0
            const maxScoreDB = datas[0]?.max_score || 0; // Giả sử max_score có sẵn trong dữ liệu
            // Số lượng học sinh chưa làm bài kiểm tra
            let countNoTest = 0;

            datas.forEach((item, index) => {
                const rowIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;
                let classes = "";
                if (item.score === maxScore && item.score !== 0) {
                    classes = "max-score";
                }

                if (item.score === minScore && minScore !== 0) {
                    classes = "min-score";
                }

                tbody.innerHTML += `
                    <tr>
                        <td>${rowIndex}</td>
                        <td style="min-width:150px; text-align:left;">${
                            item.name
                        }</td>
                        <td class=${classes}>${item.score}</td>
                        <td>${item.error}</td>
                        <td style="font-style:italic; color:#333; font-size:12px; text-align:left;" ${
                            item.comment == "Chưa đóng phạt" ||
                            item.comment == "chưa đóng phạt" ||
                            item.comment == "Chưa đóng tiền" ||
                            item.comment == "chưa đóng tiền" ||
                            item.comment == "Vắng" ||
                            item.comment == "vắng"
                                ? `class="error"`
                                : `class=""`
                        }>${item.comment}</td>
                    </tr>
                `;

                totalWrong += item.error;

                // Đếm số bài đã làm khác 0
                if (item.score > 0) {
                    totalCompletedTests++;
                }
            });

            // Tính tổng số câu dựa trên maxScore và số bài đã làm != 0
            const totalQuestions = totalCompletedTests * maxScoreDB;

            // Tính phần trăm đúng
            let correctPercent =
                totalQuestions > 0
                    ? ((totalQuestions - totalWrong) / totalQuestions) * 100
                    : 0;

            // Thêm hàng mới vào cuối bảng để hiển thị tổng số câu sai và phần trăm đúng
            tbody.innerHTML += `
                <tr class="total-row" style="height: 50px;">
                    <td text-align="center" colspan="5" style="font-weight: 600;">
                        TỔNG SỐ ĐIỂM SAI:<span style="color:${
                            totalWrong != 0 ? "red" : "green"
                        };"> ${totalWrong}</span> / ${totalQuestions} điểm
                    </td>
                </tr>
                <tr class="total-row" style="height: 50px;">
                    <td text-align="center" colspan="5" style="font-weight: 600;">
                        TỶ LỆ ĐÚNG CỦA CẢ LỚP: <span style=color:${
                            correctPercent.toFixed(2) < 60 ? "red" : "green"
                        };"> ${correctPercent.toFixed(
                2
            )}</span> %<br /><i><span style="font-weight: 300;">(Không tính những bài chưa làm)</span></i>
                    </td>
                </tr>
            `;

            table.appendChild(tbody);
            tableWrapper.appendChild(table);

            // Duyệt qua dữ liệu và thêm span cho các điểm số khác nhau
            datas.forEach((item) => {
                if (item.score === maxScore && item.score !== 0) {
                    const newSpan = document.createElement("span");
                    newSpan.textContent = `🥇 ${item.name} （ ${item.score} điểm ）`;
                    newSpan.className = "rank-item-name rank-item-name__max";
                    document
                        .querySelector(".rank-item-max")
                        .appendChild(newSpan);
                }

                if (item.score === minScore && minScore !== 0) {
                    const newSpan = document.createElement("span");
                    newSpan.textContent = `💸 ${item.name} （ ${item.score} điểm ）`;
                    newSpan.className = "rank-item-name rank-item-name__min";
                    document
                        .querySelector(".rank-item-min")
                        .appendChild(newSpan);
                }

                if (item.score === 0 && maxScore !== 0) {
                    countNoTest += 1;
                    const newSpan = document.createElement("span");
                    newSpan.textContent = `🤷‍♂️ ${item.name}`;
                    newSpan.className =
                        "rank-item-name rank-item-name__no-test";
                    document
                        .querySelector(".rank-item-no-test")
                        .appendChild(newSpan);
                }
            });
            if (countNoTest == 0 && maxScore !== 0) {
                const newSpan = document.createElement("span");
                newSpan.textContent = `・Không có ai.`;
                newSpan.className = "rank-item-name rank-item-name__no-test";
                document
                    .querySelector(".rank-item-no-test")
                    .appendChild(newSpan);
            }
        }, timeOut);
    }

    function handleChangeLessonScreen(e) {
        const classId = Number(elements.screenScoreClassDropdown.value);
        const lesson = e.target.value;
        const data = {
            class_id: classId,
            lesson: lesson,
            lesson_name: handleLessonName(lesson),
        };

        if (classId && lesson) {
            showCoreTable(data);
        } else {
            handleClearTable();
        }
    }

    elements.screenScoreLessonDropdown.addEventListener(
        "change",
        handleChangeLessonScreen
    );
    showCoreTable({
        class_id: Number(elements.screenScoreClassDropdown.value),
        lesson: Number(elements.screenScoreLessonDropdown.value),
        lesson_name: handleLessonName(lesson),
    });

    // CHỨC NĂNG QUẢN LÝ LỚP HỌC
    const managerClassOptionButtons = document.querySelectorAll(
        ".manager-class-options-btn"
    );
    const managerClassOptionForms = document.querySelectorAll(
        ".manager-class-form"
    );

    managerClassOptionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            managerClassOptionForms.forEach(
                (form) => (form.style.display = "none")
            ); // Ẩn tất cả các form
            document.getElementById(button.dataset.form).style.display =
                "block"; // Hiển thị form tương ứng
            managerClassOptionButtons.forEach((btn) =>
                btn.classList.remove("active")
            ); // Bỏ class active của các nút khác
            button.classList.add("active"); // Thêm class active cho nút được nhấn
        });
    });

    // Mặc định ẩn các form trừ form đầu tiên
    managerClassOptionForms.forEach((form) => (form.style.display = "none"));
    document.getElementById(
        managerClassOptionButtons[0].dataset.form
    ).style.display = "block";

    // Lấy danh sách lớp học để điền vào dropdown
    async function fetchClasses() {
        try {
            const response = await fetch(url + "class");
            const data = await response.json();

            // Hàm chung để cập nhật các dropdown
            const classDropdown = (element, defaultOption) => {
                element.innerHTML =
                    `<option value="">-- ${defaultOption} --</option>` +
                    data
                        .map(
                            (item) =>
                                `<option value="${item.id}">${item.classname}</option>`
                        )
                        .join("");
            };

            // Cập nhật các dropdown
            classDropdown(elements.oldClassDropdown, "Chọn Lớp Học");
            classDropdown(elements.deleteClassDropdown, "Chọn Lớp Học");
            classDropdown(elements.oldStudentDropdown, "Chọn Lớp Học");
            classDropdown(elements.updateStudentDropdown, "Chọn Lớp Học");
            classDropdown(elements.deleteStudentDropdown, "Chọn Lớp Học");
            classDropdown(elements.tableStudentDropdown, "Chọn Lớp Học");
            classDropdown(elements.insertScoreClassDropdown, "Chọn Lớp Học");
            classDropdown(elements.deleteScoreClassDropdown, "Chọn Lớp Học");
            classDropdown(elements.screenScoreClassDropdown, "Chọn Lớp Học");
            classDropdown(elements.logBookWriteDropdown, "Chọn Lớp Học");
            classDropdown(elements.logBookSearchClassDropdown, "Tất cả");
            classDropdown(elements.rankSelectClass, "Tất cả");
            classDropdown(elements.listStudentClassDropdown, "Tất cả");

            // Cập nhật bảng thông tin class
            const tbody = document.querySelector("#class-table tbody");
            tbody.innerHTML = data
                .map((item, index) => {
                    const createdAt = new Date(item.created_at);
                    const formattedDate = `${String(
                        createdAt.getDate()
                    ).padStart(2, "0")}-${String(
                        createdAt.getMonth() + 1
                    ).padStart(2, "0")}-${createdAt.getFullYear()}`;
                    return `
                        <tr>
                            <td>${String(index + 1).padStart(2, "0")}</td>
                            <td>${item.classname}</td>
                            <td>${item.student_count}</td>
                            <td>${item.lesson_count} bài</td>
                            <td>${formattedDate}</td>
                        </tr>`;
                })
                .join("");
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
        }
    }

    // Xử lý thêm lớp học mới
    document
        .getElementById("add-class-form")
        .addEventListener("submit", async function (event) {
            event.preventDefault(); // Ngăn không gửi yêu cầu HTTP mặc định

            const classname = document.getElementById("add-classname").value;
            const data = { classname };

            try {
                showLoadingModal();
                const response = await fetch(url + "class", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const message = await response.text();
                setTimeout(() => {
                    hideLoadingModal();
                    alert(message);
                }, timeOut);
                fetchClasses();
            } catch (error) {
                console.error("Có lỗi xảy ra khi thêm lớp học mới:", error);
            }
        });

    // Xử lý cập nhật lớp học
    async function updateClass(classId, newClassname) {
        try {
            showLoadingModal();
            const response = await fetch(url + "class", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: classId, classname: newClassname }),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const message = await response.text();
            setTimeout(() => {
                hideLoadingModal();
                alert(message);
                document.getElementById("edit-class-form").reset();
            }, timeOut);
            fetchClasses();
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật lớp học:", error);
        }
    }

    // Xử lý sửa lớp học
    document
        .getElementById("edit-class-form")
        .addEventListener("submit", async function (event) {
            event.preventDefault(); // Ngăn không gửi yêu cầu HTTP mặc định

            const classId = document.getElementById("old-class-dropdown").value;
            const newClassname = document.getElementById("new-classname").value;

            if (classId && newClassname) {
                await updateClass(classId, newClassname);
            } else {
                alert("Vui lòng chọn lớp học và nhập tên lớp học mới.");
            }
        });

    // Xử lý xóa lớp học
    document
        .getElementById("delete-class-form")
        .addEventListener("submit", async function (event) {
            event.preventDefault(); // Ngăn không gửi yêu cầu HTTP mặc định

            const classId = document.getElementById(
                "delete-class-dropdown"
            ).value;

            if (classId) {
                // Hiển thị hộp thoại xác nhận trước khi xóa
                const confirmDelete = confirm(
                    "Xoá lớp học đồng thời cũng xoá hết học sinh trong lớp, và bảng điểm của học sinh này, bạn đồng ý xoá chứ?"
                );

                if (confirmDelete) {
                    try {
                        showLoadingModal();
                        const response = await fetch(url + "class", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: classId }),
                        });
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        const message = await response.text();
                        setTimeout(() => {
                            hideLoadingModal();
                            alert(message);
                        }, timeOut);
                        fetchClasses();
                    } catch (error) {
                        console.error("Có lỗi xảy ra khi xóa lớp học:", error);
                    }
                }
            } else {
                alert("Vui lòng chọn lớp học để xóa.");
            }
        });

    // STUDENT MANAGER

    const managerStudentOptionButtons = document.querySelectorAll(
        ".manager-student-options-btn"
    );
    const managerStudentOptionForms = document.querySelectorAll(
        ".manager-student-form"
    );

    managerStudentOptionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            managerStudentOptionForms.forEach(
                (form) => (form.style.display = "none")
            ); // Ẩn tất cả các form
            document.getElementById(button.dataset.form).style.display =
                "block"; // Hiển thị form tương ứng
            managerStudentOptionButtons.forEach((btn) =>
                btn.classList.remove("active")
            ); // Bỏ class active của các nút khác
            button.classList.add("active"); // Thêm class active cho nút được nhấn
        });
    });

    // Mặc định ẩn các form trừ form đầu tiên
    managerStudentOptionForms.forEach((form) => (form.style.display = "none"));
    document.getElementById(
        managerStudentOptionButtons[0].dataset.form
    ).style.display = "block";

    const inputField = document.getElementById("name");
    const inputNameTeacher = document.getElementById("log-book-write__teacher");

    // Viết hoa chữ cái đầu của từng từ và cập nhật giá trị của trường input
    inputField.addEventListener("input", () => {
        const value = inputField.value;
        inputField.value = capitalizeFirstLetterOfEachWord(value);
    });
    inputNameTeacher.addEventListener("input", () => {
        const value = inputNameTeacher.value;
        inputNameTeacher.value = capitalizeFirstLetterOfEachWord(value);
    });
    function capitalizeFirstLetterOfEachWord(str) {
        return str
            .split(" ") // Chia chuỗi thành mảng các từ
            .map((word) => {
                // Viết hoa chữ cái đầu và giữ nguyên các chữ cái còn lại
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            })
            .join(" "); // Kết hợp các từ lại thành chuỗi
    }
    // Hàm để gửi yêu cầu POST thêm học sinh mới
    async function addStudent(classId, name, sex) {
        try {
            showLoadingModal();
            const response = await fetch(url + "student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ class_id: classId, name, sex }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.text();
            setTimeout(() => {
                hideLoadingModal();
                alert(result);
                elements.oldStudentDropdown.value = classId;
                document.querySelector(".add-student-input").value = "";
                document.querySelector("#sex").value = "Nam";
            }, timeOut);
            initStudentList();
        } catch (error) {
            console.error("Có lỗi xảy ra khi thêm học sinh:", error);
            alert("Có lỗi xảy ra khi thêm học sinh.");
        }
    }

    // Xử lý khi gửi form thêm học sinh
    document
        .getElementById("add-student-form")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Ngăn không cho form gửi yêu cầu HTTP mặc định

            const classId = elements.oldStudentDropdown.value;
            const name = document.getElementById("name").value.trim();
            const sex = document.getElementById("sex").value;

            if (classId && name && sex) {
                // Gọi hàm thêm học sinh mới
                addStudent(classId, name, sex);
            } else {
                alert("Vui lòng chọn lớp học và nhập họ tên học sinh.");
            }
        });

    // SỬA ĐIỂM HỌC SINH
    // Hàm render cho options
    // Hàm render cho options và cập nhật danh sách học sinh theo classId
    function renderStudentOptions(classId, selectElement) {
        listFilteredStudentsByClassId = students.filter(
            (student) => student.class_id === Number(classId)
        );

        const optionsHtml = listFilteredStudentsByClassId
            .map(
                (student) =>
                    `<option value="${student.id}">${student.name}</option>`
            )
            .join("");
        if (selectElement) {
            selectElement.innerHTML =
                `<option value="">-- Chọn Học Sinh --</option>` + optionsHtml;
        }
    }

    // Hàm gọi API để lấy dữ liệu điểm mới và chú thích
    async function fetchScoreData(class_id, student_id, lesson) {
        try {
            showLoadingModal();
            // Reset giá trị input trước khi gửi yêu cầu
            document.getElementById("new-score").value = "";
            document.getElementById("comment").value = "";

            // Gửi yêu cầu POST tới API
            const response = await fetch(url + "score-student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    class_id,
                    student_id,
                    lesson,
                    lesson_name: handleLessonName(lesson),
                }),
            });

            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            setTimeout(() => {
                hideLoadingModal();
                // Kiểm tra nếu data không rỗng và có phần tử đầu tiên
                if (data) {
                    elements.showMaxScoreUpdate.textContent = `${data[0].max_score} đ`;
                    document.getElementById("new-score").max =
                        data[0].max_score || "50"; // Đặt giá trị mặc định là 50 nếu max_score rỗng
                    document.getElementById("new-score").value =
                        data[0].score || ""; // Nếu không có điểm thì để trống
                    document.getElementById("comment").value =
                        data[0].comment || ""; // Nếu không có bình luận thì để trống
                }
            }, timeOut);
        } catch (error) {
            hideLoadingModal();
            console.error("Error fetching score data:", error);
        }
    }

    // Hàm xử lý thay đổi giá trị của student-select
    function handleStudentSelectChange() {
        const class_id = document.getElementById(
            "update-student-dropdown"
        ).value;
        const student_id = document.getElementById("student-select").value;
        const lesson = document.getElementById("lesson").value;

        if (class_id && student_id && lesson != 0) {
            fetchScoreData(
                Number(class_id),
                Number(student_id),
                Number(lesson)
            );
        }
    }

    // Hàm để gửi yêu cầu POST cập nhật điểm học sinh
    async function updateScore(
        studentId,
        classId,
        lesson,
        maxScore,
        score,
        comment,
        lessonName
    ) {
        const datas = {
            student_id: studentId,
            class_id: classId,
            lesson,
            max_score: maxScore,
            lesson_name: lessonName,
            score,
            comment,
        };
        try {
            showLoadingModal();
            const response = await fetch(url + "score", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datas),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.text();
            setTimeout(() => {
                hideLoadingModal();
                alert(result);
                // reset lại table sau khi sửa điểm
                document.getElementById("student-select").value = "";
                document.getElementById("new-score").value = "";
                document.getElementById("comment").value = "";
            }, timeOut);
            handleClearTable();
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật điểm:", error);
            alert("Có lỗi xảy ra khi cập nhật điểm.");
        }
    }

    // Thêm sự kiện cho dropdown student-select
    document
        .getElementById("student-select")
        .addEventListener("change", handleStudentSelectChange);

    // Thêm sự kiện cho input lesson
    let typingTimer;

    elements.updateScoreLessonDropdown.addEventListener("change", function () {
        clearTimeout(typingTimer); // Xóa timeout cũ
        typingTimer = setTimeout(() => {
            const class_id = document.getElementById(
                "update-student-dropdown"
            ).value;
            const student_id = document.getElementById("student-select").value;
            const lesson = this.value;

            if (class_id && student_id && lesson != 0) {
                fetchScoreData(
                    Number(class_id),
                    Number(student_id),
                    Number(lesson)
                );
            }
        }, doneTypingInterval);
    });

    // Xử lý khi gửi form cập nhật điểm
    document
        .getElementById("update-score-form")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Ngăn không cho form gửi yêu cầu HTTP mặc định

            const classDropdown = document.getElementById(
                "update-student-dropdown"
            );
            const classId = classDropdown.value;
            const studentId = document.getElementById("student-select").value;
            const lesson = document.getElementById("lesson").value.trim();
            const lessonName = handleLessonName(lesson);
            const maxScore = document.getElementById("new-score").max;
            const score = document.getElementById("new-score").value.trim();
            const comment = document.getElementById("comment").value.trim();

            if (classId && studentId && lesson && score) {
                // Gọi hàm cập nhật điểm học sinh
                updateScore(
                    studentId,
                    classId,
                    lesson,
                    maxScore,
                    score,
                    comment,
                    lessonName
                );
            } else {
                alert("Vui lòng chọn lớp học, học sinh, bài và điểm.");
            }
        });

    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh
    document
        .getElementById("update-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            const studentSelect = document.getElementById("student-select");
            if (classId) {
                renderLesson(classId);
                renderStudentOptions(classId, studentSelect);
            }
        });

    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh ở table
    document
        .getElementById("table-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            const tableStudentSelect = document.getElementById(
                "table-student-select"
            );
            if (classId) {
                renderStudentOptions(classId, tableStudentSelect);
            }
        });

    let selectedStudents = new Set();
    elements.logBookWriteDropdown.addEventListener("change", async function () {
        const classId = this.value;
        if (classId) {
            renderStudentOptions(classId);
        }
    });

    // DELETE Student
    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh cho việc xóa
    document
        .getElementById("table-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            const tableStudentSelect = document.getElementById(
                "table-student-select"
            );
            if (classId) {
                renderStudentOptions(classId, tableStudentSelect);
            }
        });

    document.addEventListener("click", function (e) {
        if (
            !document
                .getElementById("log-book-write__absent")
                .contains(e.target)
        ) {
            document.getElementById("suggestions-list").innerHTML = "";
        }
    });

    // Hàm để gửi yêu cầu DELETE xóa học sinh
    async function deleteStudent(studentId, classId) {
        try {
            showLoadingModal();
            const response = await fetch(url + `student`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: studentId,
                    class_id: classId,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.text();
            setTimeout(() => {
                hideLoadingModal();
                alert(result);
            }, timeOut);
            initStudentList();
            document.getElementById("delete-student-form").reset();
            // Thực hiện các hành động sau khi xóa thành công, ví dụ: làm mới dữ liệu hoặc thông báo
        } catch (error) {
            console.error("Có lỗi xảy ra khi xóa học sinh:", error);
            alert("Có lỗi xảy ra khi xóa học sinh.");
        }
    }

    // Xử lý khi gửi form xóa học sinh
    document
        .getElementById("delete-student-form")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Ngăn không cho form gửi yêu cầu HTTP mặc định

            const classDropdown = document.getElementById(
                "delete-student-dropdown"
            );
            const classId = classDropdown.value;
            const studentId = document.getElementById(
                "delete-student-select"
            ).value;

            if (classId && studentId) {
                // Hiển thị hộp thoại xác nhận trước khi xóa
                const confirmDelete = confirm(
                    "Xoá học sinh đồng thời cũng xoá hết tất cả điểm của học sinh này, bạn đồng ý xoá chứ?"
                );

                if (confirmDelete) {
                    // Gọi hàm xóa học sinh nếu người dùng xác nhận
                    deleteStudent(studentId, classId);
                }
            } else {
                alert("Vui lòng chọn lớp học và học sinh.");
            }
        });

    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh cho việc xóa
    document
        .getElementById("delete-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            const studentSelect = document.getElementById(
                "delete-student-select"
            );
            if (classId) {
                renderStudentOptions(classId, studentSelect);
            }
        });

    async function renderTableScoreStudent(
        classId = elements.tableStudentDropdown.value,
        studentId = elements.tableStudentDropdown.value
    ) {
        showLoadingModal();
        const response = await fetch(`${url}class/student`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                class_id: classId,
                student_id: studentId,
            }),
        });

        const scores = await response.json();
        setTimeout(() => {
            hideLoadingModal();

            // Lấy bảng
            const table = document.getElementById("student-score-table");

            // Tạo phần thead (tiêu đề bảng)
            const thead = document.createElement("thead");
            thead.innerHTML = `
                    <tr>
                        <th>STT</th>
                        <th>Nội Dung</th>
                        <th class="score-table-window">Thang Điểm</th>
                        <th class="score-table-window">Điểm</th>
                        <th>Chú Thích</th>
                        <th>Ngày Tạo</th>
                    </tr>
                `;

            // Tạo phần tbody (nội dung bảng)
            const tbody = document.createElement("tbody");

            if (scores.length === 0) {
                // Hiển thị thông báo khi không có dữ liệu
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td colspan="6" class="text-center">Chưa có bảng điểm</td>
                    `;
                tbody.appendChild(row);
            } else {
                scores.forEach((score, index) => {
                    const row = document.createElement("tr");
                    // Thêm số thứ tự với định dạng số 0 nếu nhỏ hơn 10
                    const formattedIndex = (index + 1)
                        .toString()
                        .padStart(2, "0");
                    // Thêm hàng dữ liệu
                    row.innerHTML = `
                            <td>${formattedIndex}</td>
                            <td>${handleLessonName(score.lesson)}</td>
                            <td>${score.max_score}</td>
                            <td>${score.score}</td>
                            <td style="font-style:italic; color:#333; font-size:12px; text-align:left;" ${
                                score.comment.match(
                                    /Chưa đóng phạt|chưa đóng phạt|Chưa đóng tiền|chưa đóng tiền|Vắng|vắng/
                                )
                                    ? `class="error"`
                                    : `class=""`
                            }>${score.comment}</td>
                            <td>${formatShortDateTime(score.created_at)}</td>
                        `;
                    tbody.appendChild(row);
                });
            }

            // Xóa nội dung cũ và chèn thead, tbody mới
            table.innerHTML = "";
            table.appendChild(thead);
            table.appendChild(tbody);
        }, timeOut);
    }

    // Gọi hàm khi cần thay đổi lớp học hoặc học sinh
    document
        .getElementById("table-student-select")
        .addEventListener("change", async function () {
            const classId = document.getElementById(
                "table-student-dropdown"
            ).value;
            const studentId = this.value;

            if (classId && studentId) {
                renderTableScoreStudent(classId, studentId);
            }
        });

    // DANH SÁCH HỌC SINH
    // Hàm gọi API để lấy danh sách học sinh
    async function fetchStudents(classId) {
        showLoadingModal();
        let path = url + "students"; // Mặc định là không có classId
        if (classId) {
            path += `?classId=${classId}`;
        }

        const response = await fetch(path);
        const students = await response.json();
        hideLoadingModal();
        return students;
    }

    let filteredStudents = [];
    let filterClassName = "";

    // Hàm để lấy phần tên cuối cùng của họ và tên
    function getLastName(fullName) {
        const nameParts = fullName.trim().split(" ");
        return nameParts[nameParts.length - 1]; // Trả về phần tên cuối cùng
    }

    // Cập nhật icon sắp xếp cho cột
    function updateSortIcons(sortType) {
        const nameSortIcon = document.getElementById("name-sort-icon");
        const sexSortIcon = document.getElementById("sex-sort-icon");
        const classSortIcon = document.getElementById("class-sort-icon");
        const dateSortIcon = document.getElementById("date-sort-icon");

        // Kiểm tra sự tồn tại của các phần tử trước khi thay đổi className
        if (nameSortIcon && dateSortIcon) {
            // Reset các icon về trạng thái mặc định
            nameSortIcon.className = "fa-solid";
            dateSortIcon.className = "fa-solid";

            // Cập nhật icon theo kiểu sắp xếp hiện tại
            if (sortType === "name-asc") {
                nameSortIcon.classList.add("fa-arrow-down-a-z");
            } else if (sortType === "name-desc") {
                nameSortIcon.classList.add("fa-arrow-down-z-a");
            } else if (sortType === "date-asc") {
                dateSortIcon.classList.add("fa-arrow-down-1-9");
            } else if (sortType === "date-desc") {
                dateSortIcon.classList.add("fa-arrow-down-9-1");
            } else if (sortType === "class-asc") {
                classSortIcon.classList.add("fa-arrow-down-a-z");
            } else if (sortType === "class-desc") {
                classSortIcon.classList.add("fa-arrow-down-z-a");
            } else if (sortType === "sex-asc") {
                sexSortIcon.classList.add("fa-mars-and-venus");
            } else if (sortType === "sex-desc") {
                sexSortIcon.classList.add("fa-mars-and-venus");
            }
        } else {
            console.error("Không tìm thấy các icon sắp xếp trong DOM.");
        }
    }

    // Hàm render danh sách học sinh vào bảng sau khi lọc và sắp xếp
    function renderStudents(studentList) {
        filteredStudents = studentList;
        const sortType = document.getElementById("sort-student-select").value;

        // Kiểm tra xem bảng có tồn tại trong DOM không
        const table = document.querySelector(".list-student-table");
        if (!table) {
            console.error(
                "Không tìm thấy phần tử bảng với class .list-student-table"
            );
            return;
        }

        // Sắp xếp danh sách học sinh theo lựa chọn
        if (sortType === "name-asc") {
            studentList.sort((a, b) =>
                getLastName(a.name).localeCompare(getLastName(b.name))
            );
        } else if (sortType === "name-desc") {
            studentList.sort((a, b) =>
                getLastName(b.name).localeCompare(getLastName(a.name))
            );
        } else if (sortType === "date-asc") {
            studentList.sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        } else if (sortType === "date-desc") {
            studentList.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        } else if (sortType === "class-asc") {
            studentList.sort((a, b) => a.classname.localeCompare(b.classname));
        } else if (sortType === "class-desc") {
            studentList.sort((a, b) => b.classname.localeCompare(a.classname));
        } else if (sortType === "sex-asc") {
            studentList.sort((a, b) => a.sex.localeCompare(b.sex));
        } else if (sortType === "sex-desc") {
            studentList.sort((a, b) => b.sex.localeCompare(a.sex));
        }

        // Xóa các hàng cũ trong bảng (trừ hàng tiêu đề)
        table.innerHTML = `
        <tr>
            <th>STT</th>
            <th>Họ và Tên<i id="name-sort-icon" class="fa-solid fa-sort"></i></th>
            <th>Giới Tính<i id="sex-sort-icon" class="fa-solid"></i></th>
            <th>Lớp Học<i id="class-sort-icon" class="fa-solid"></i></th>
            <th>Ngày Tham Gia<i id="date-sort-icon" class="fa-solid fa-sort"></i></th>
        </tr>
    `;

        // Render lại danh sách học sinh
        studentList.forEach((student, index) => {
            const row = document.createElement("tr");
            row.style.animationDelay = `0.${index}s`;
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.sex}</td>
            <td>${student.classname}</td>
            <td>${formatShortDateTime(student.created_at)}</td>
        `;
            table.appendChild(row);
        });

        // Cập nhật icon sắp xếp sau khi render bảng
        updateSortIcons(sortType);
    }

    // Hàm lọc học sinh theo lớp đã chọn
    function filterStudentsByClass(classId) {
        let filteredStudents = students;

        // Nếu classId tồn tại và khác "all", lọc danh sách học sinh theo class_id
        if (classId && classId !== "all") {
            filterClassName =
                elements.listStudentClassDropdown.options[
                    elements.listStudentClassDropdown.selectedIndex
                ].textContent;

            filteredStudents = students.filter((student) => {
                return student.class_id == Number(classId);
            });
        } else {
            filterClassName = "";
        }

        // Sau khi lọc, render danh sách học sinh đã lọc và sắp xếp
        renderStudents(filteredStudents);
    }

    // Hàm gọi API để tải tất cả học sinh
    async function fetchAllStudents() {
        const datas = await fetchStudents(); // Giả sử fetchStudents() trả về tất cả học sinh
        students = datas; // Lưu lại danh sách học sinh sau khi tải về
    }

    // Hàm chính để tải danh sách học sinh một lần và lắng nghe sự kiện thay đổi lớp
    async function initStudentList() {
        await fetchAllStudents(); // Tải tất cả học sinh khi khởi động
        filterStudentsByClass(elements.listStudentClassDropdown.value); // Lọc học sinh theo lớp học ban đầu

        // Lắng nghe sự kiện thay đổi lớp học để lọc học sinh
        elements.listStudentClassDropdown.addEventListener(
            "change",
            function () {
                const classId = this.value;
                filterStudentsByClass(classId); // Lọc và hiển thị lại danh sách học sinh theo lớp
            }
        );

        // Lắng nghe sự kiện thay đổi loại sắp xếp
        document
            .getElementById("sort-student-select")
            .addEventListener("change", function () {
                const classId = elements.listStudentClassDropdown.value;

                filterStudentsByClass(classId); // Lọc lại danh sách sau khi thay đổi sắp xếp
            });
    }

    // NHẬP ĐIỂM
    let insertMaxScore = document.getElementById(
        "insert-score__max-score"
    ).value;
    function renderCurentTable() {
        document
            .getElementById("insert-score__student-table")
            .getElementsByTagName("tbody")[0].innerHTML = `
        <tr>
        <td colspan="4" class="text-center">Chưa chọn lớp học</td>
        </tr>
        `;
    }
    renderCurentTable();

    // Chọn nội dung kiểm tra
    document
        .getElementById("insert-score__test-content-dropdown")
        .addEventListener("change", function () {
            const lessonDropdown = document.getElementById(
                "insert-score__lesson-dropdown"
            );
            const selectedValue = Number(this.value);

            // Xóa hết các tùy chọn hiện có
            lessonDropdown.innerHTML =
                '<option value="">-- Chọn Bài --</option>';

            // Nếu không phải là bài kiểm tra định kỳ hay JLPT, thêm các bài học từ 1 đến 50

            let options = "";
            if (selectedValue === 0) {
                for (let i = 1; i <= 50; i++) {
                    options += `<option value="${i}">${handleLessonName(
                        i
                    )}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 1) {
                for (let i = 1; i <= 50; i++) {
                    options += `<option value="${i + 100}">${handleLessonName(
                        i + 100
                    )}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 2) {
                for (let i = 1; i <= 32; i++) {
                    options += `<option value="${i + 200}">${handleLessonName(
                        i + 200
                    )}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 3) {
                for (let i = 1; i <= 50; i += 2) {
                    options += `<option value="${
                        i + 1 + 300
                    }">${handleLessonName(i + 1 + 300)}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 4) {
                for (let i = 1; i <= 50; i += 5) {
                    options += `<option value="${
                        i + 4 + 400
                    }">${handleLessonName(i + 4 + 400)}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 5) {
                for (let i = 1; i <= 30; i += 5) {
                    options += `<option value="${
                        i + 4 + 500
                    }">${handleLessonName(i + 4 + 500)}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 6) {
                for (let i = 1; i <= 10; i++) {
                    options += `<option value="${i + 600}">${handleLessonName(
                        i + 600
                    )}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else if (selectedValue === 7) {
                for (let i = 1; i <= 25; i++) {
                    options += `<option value="${i + 700}">${handleLessonName(
                        i + 700
                    )}</option>`;
                }
                lessonDropdown.innerHTML += options;
            } else {
                options += `<option value="">-- Chọn Bài --</option>`;
                lessonDropdown.innerHTML += options;
            }
            // Bạn có thể thêm logic riêng nếu cần xử lý cho các bài kiểm tra định kỳ hoặc JLPT
        });

    // Lấy thang điểm đưa vào max-score
    function handleInputMaxScore() {
        const insertMaxScore = this.value;
        const insertScoreElements =
            document.querySelectorAll(".max-score_input");
        for (let i = 0; i < insertScoreElements.length; i++) {
            insertScoreElements[i].max = insertMaxScore;
        }
    }

    // Hàm để reset lại max-score về giá trị mặc định 50 sau khi form được reset
    function resetMaxScoreInputs() {
        const insertScoreElements =
            document.querySelectorAll(".max-score_input");
        for (let i = 0; i < insertScoreElements.length; i++) {
            insertScoreElements[i].max = document.getElementById(
                "insert-score__max-score"
            ).value;
        }
    }

    document
        .getElementById("insert-score__max-score")
        .addEventListener("input", handleInputMaxScore);
    // Hàm để lấy danh sách học sinh và cập nhật vào bảng
    async function updateStudentTable() {
        const classId = document.getElementById(
            "insert-score__class-dropdown"
        ).value;

        if (!classId) {
            alert("Vui lòng chọn lớp học.");
            renderCurentTable();
            return;
        }

        // Gửi yêu cầu API để lấy danh sách học sinh theo lớp
        showLoadingModal();
        const response = await fetch(`${url}students?classId=${classId}`);
        const students = await response.json();
        hideLoadingModal();

        // Lấy bảng tbody và xóa các hàng hiện tại
        const tbody = document
            .getElementById("insert-score__student-table")
            .getElementsByTagName("tbody")[0];

        if (students.length === 0) {
            tbody.innerHTML = `
            <tr>
            <td colspan="4" class="text-center">Chưa có học sinh</td>
            </tr>
            `;
        } else {
            tbody.innerHTML = "";
            // Thêm dữ liệu học sinh vào bảng
            students.forEach((student, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${index + 1 < 10 ? "0" : ""}${index + 1}</td>
                <td style="text-align: left;">${student.name}</td>
                <td><input type="number" max="${insertMaxScore}" name="score-${
                    student.id
                }" class="form-control max-score_input" /></td>
                <td><input type="text" name="comment-${
                    student.id
                }" class="form-control" /></td>
            `;
                tbody.appendChild(row);
            });
        }
    }

    // FORM NHẬP ĐIỂM SUBMIT
    document
        .getElementById("score-form")
        .addEventListener("submit", async (event) => {
            event.preventDefault(); // Ngăn chặn hành động submit mặc định của form

            // Thêm bước xác nhận trước khi gửi dữ liệu
            const confirmSubmit = confirm(
                "Bạn chắc chắn đã nhập điểm xong + đúng tên lớp và nội dung kiểm tra ? Tiến hành xử lý dữ liệu..."
            );
            if (!confirmSubmit) {
                return; // Hủy gửi form nếu người dùng không chắc chắn
            }

            const classId = document.getElementById(
                "insert-score__class-dropdown"
            ).value;
            const lesson = document.getElementById(
                "insert-score__lesson-dropdown"
            ).value;
            const tbody = document
                .getElementById("insert-score__student-table")
                .getElementsByTagName("tbody")[0];
            const rows = tbody.getElementsByTagName("tr");

            if (!classId) {
                alert("Vui lòng chọn lớp.");
                return;
            }
            if (!lesson || lesson == 0) {
                alert("Vui lòng chọn bài.");
                return;
            }

            const scoresData = [];

            // Duyệt qua các hàng trong bảng để lấy thông tin
            for (let row of rows) {
                const studentId = row
                    .querySelector('input[name^="score-"]')
                    .name.split("-")[1];
                const score = row.querySelector(
                    `input[name="score-${studentId}"]`
                ).value;
                const comment = row.querySelector(
                    `input[name="comment-${studentId}"]`
                ).value;
                const maxScore = row.querySelector(
                    `input[name="score-${studentId}"]`
                ).max;

                scoresData.push({
                    student_id: Number(studentId),
                    class_id: Number(classId),
                    lesson: Number(lesson),
                    lesson_name: handleLessonName(lesson),
                    max_score: Number(maxScore),
                    score: Number(score),
                    comment: comment,
                });
            }

            // Gửi dữ liệu lên API
            try {
                showLoadingModal();
                const response = await fetch(url + "score", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(scoresData),
                });

                const result = await response.json();
                setTimeout(() => {
                    hideLoadingModal();
                    alert(result.title);
                    if (result.status == "success") {
                        document.getElementById("score-form").reset();
                        resetMaxScoreInputs();
                        elements.screenScoreClassDropdown.value = "";
                        elements.screenScoreLessonDropdown.value = "";
                        handleClearTable();
                    }
                }, timeOut);
            } catch (error) {
                alert("Lỗi kết nối tới server.");
            }
        });

    // SCREEN SCORE LESSON
    elements.screenScoreClassDropdown.addEventListener("change", function () {
        const classId = this.value;
        if (classId) {
            renderLesson(classId);
        } else {
            handleClearTable();
        }
    });

    // DELETE SCORE LESSON
    elements.deleteScoreClassDropdown.addEventListener("change", function () {
        const classId = this.value;
        renderLesson(classId);
    });

    function renderLesson(classId) {
        if (classId) {
            showLoadingModal();
            fetch(`${url}class/${classId}`)
                .then((response) => response.json())
                .then((datas) => {
                    setTimeout(() => {
                        hideLoadingModal();
                        // Xóa các tùy chọn cũ
                        elements.deleteScoreLessonDropdown.innerHTML =
                            '<option value="">-- Chọn Bài --</option>';

                        // Thêm các tùy chọn mới
                        datas.forEach((data) => {
                            const option = document.createElement("option");
                            option.value = data.lesson; // Hoặc trường dữ liệu thích hợp
                            option.textContent = `${handleLessonName(
                                data.lesson
                            )}`; // Hoặc trường dữ liệu thích hợp
                            elements.deleteScoreLessonDropdown.appendChild(
                                option
                            );
                        });

                        // Xóa các tùy chọn cũ
                        elements.screenScoreLessonDropdown.innerHTML =
                            '<option value="">-- Chọn Bài --</option>';

                        // Thêm các tùy chọn mới
                        datas.forEach((data) => {
                            const option = document.createElement("option");
                            option.value = data.lesson; // Hoặc trường dữ liệu thích hợp
                            option.textContent = `${handleLessonName(
                                data.lesson
                            )}`; // Hoặc trường dữ liệu thích hợp
                            elements.screenScoreLessonDropdown.appendChild(
                                option
                            );
                        });

                        // FORM UPDATE ĐIỂM
                        // Xóa các tùy chọn cũ
                        elements.updateScoreLessonDropdown.innerHTML =
                            '<option value="">-- Chọn Bài --</option>';

                        // Thêm các tùy chọn mới
                        datas.forEach((data) => {
                            const option = document.createElement("option");
                            option.value = data.lesson; // Hoặc trường dữ liệu thích hợp
                            option.textContent = `${handleLessonName(
                                data.lesson
                            )}`; // Hoặc trường dữ liệu thích hợp
                            elements.updateScoreLessonDropdown.appendChild(
                                option
                            );
                        });
                    }, timeOut);
                })
                .catch((error) => {
                    console.error("Error fetching lessons:", error);
                });
        } else {
            // Nếu không có lớp học nào được chọn, reset dropdown bài học
            elements.deleteScoreLessonDropdown.innerHTML =
                '<option value="">-- Chọn Bài --</option>';
        }
    }
    // Lắng nghe sự kiện submit của form
    elements.deleteScoreLesson.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn form gửi đi tự động

        // Lấy giá trị classId và lesson từ các dropdown
        const classId = elements.deleteScoreClassDropdown.value;
        const lesson = elements.deleteScoreLessonDropdown.value;

        // Kiểm tra nếu cả classId và lesson đều đã được chọn
        if (classId && lesson && classId != 0) {
            // Hiển thị hộp thoại xác nhận trước khi xoá
            const confirmation = confirm(
                "Toàn bộ điểm của học sinh bài này sẽ mất hết, không thể khôi phục. Bạn chắc chắn xoá chứ ?"
            );

            // Nếu người dùng xác nhận, tiến hành gửi yêu cầu xoá điểm
            if (confirmation) {
                showLoadingModal();
                fetch(url + "lesson", {
                    method: "DELETE", // Sử dụng phương thức DELETE
                    headers: {
                        "Content-Type": "application/json", // Định dạng dữ liệu gửi đi
                    },
                    body: JSON.stringify({
                        class_id: classId,
                        lesson: lesson,
                        lesson_name: handleLessonName(lesson),
                    }), // Gửi dữ liệu class_id và lesson dưới dạng JSON
                })
                    .then((response) => response.text())
                    .then((message) => {
                        hideLoadingModal();
                        renderLesson(classId);
                        alert(message); // Thông báo thành công nếu xoá điểm thành công
                        // Thực hiện các hành động tiếp theo nếu cần, ví dụ như làm mới bảng điểm
                    })
                    .catch((error) => {
                        console.error("Có lỗi:", error); // Log lỗi nếu có lỗi xảy ra trong quá trình xoá
                        alert("Đã xảy ra lỗi khi xoá điểm !"); // Thông báo lỗi cho người dùng
                    });
            }
        } else {
            // Nếu lớp học hoặc bài học chưa được chọn, yêu cầu người dùng chọn trước khi xoá
            alert("Vui lòng chọn lớp học và bài học trước khi xoá !");
        }
    });

    function updateValueLessonDropdown(event) {
        document.getElementById("insert-score__lesson-dropdown").value =
            event.target.value;
    }

    // Thêm sự kiện change cho dropdown lớp học
    document
        .getElementById("insert-score__class-dropdown")
        .addEventListener("change", updateStudentTable);
    // Thêm sự kiện change cho dropdown bài học
    document
        .getElementById("insert-score__lesson-dropdown")
        .addEventListener("change", updateValueLessonDropdown);

    /** CLASS LOG BOOK - Sổ đầu bài */
    /** TODAY LOG BOOK */
    function renderLogBook(element, logInfo) {
        // Xóa nội dung cũ nếu cần
        element.innerHTML = "";

        // Kiểm tra xem logClassData có phải là một mảng không
        if (!Array.isArray(logInfo)) {
            console.error("logInfo không phải là array:", logInfo);
            return; // Dừng hàm nếu không phải là mảng
        }

        // Kiểm tra nếu mảng rỗng
        if (logInfo.length === 0) {
            const noDataHtml = `
                <div class="no-data">
                    <img class="no-data-img" src="access/images/no-data.jpeg" alt="No Data" style="animation: fadeIn 1s forwards;" />
                </div>
            `;
            element.innerHTML = noDataHtml;
            return; // Dừng hàm nếu không có dữ liệu
        }

        logInfo.forEach((log, index) => {
            const {
                log_id,
                classname: className,
                student_count: studentCount,
                teacher,
                part,
                log_at: dateInfo,
                content,
                absentees = [],
            } = log;

            // Phân loại học sinh vắng có phép và không phép
            const absentWithPermission = absentees.filter(
                (student) => student.absent == true
            );
            const absentWithoutPermission = absentees.filter(
                (student) => student.absent == false
            );

            const logBookElement = document.createElement("div");
            logBookElement.className = "log-book-today-class";

            let classes = "slide-in-right";
            // Thêm lớp animation dựa trên chỉ số chẵn/lẻ
            if (logInfo.length > 1) {
                // Kiểm tra nếu có hơn 1 phần tử
                if (index % 2 === 0) {
                    classes = "slide-in-left";
                } else {
                    classes = "slide-in-right";
                }
            } else {
                // Nếu chỉ có 1 phần tử, thêm lớp mặc định (nếu cần)
                classes = "slide-in-right";
            }

            // Create the HTML structure
            const logBookHtml = `
                    <div class="log-book-today-class ${classes}" style="animation-delay: 0.${index}s;">
                        <div class="log-book-today-class-item">
                            <div class="log-book-heading">
                                <p class="log-book-heading-item">
                                    <i class="fa-solid fa-school"></i>
                                    Lớp: ${className}
                                </p>
                                <p class="log-book-heading-item">
                                    <i class="fa-solid fa-graduation-cap"></i>
                                    Sĩ số: ${studentCount}
                                </p>
                                <p class="log-book-heading-item">
                                    <i class="fa-solid fa-person-chalkboard"></i>
                                    GV: ${teacher}
                                </p>
                            </div>
                            <div class="log-book-date">
                                <div class="log-book-date-item">
                                    <i class="fa-solid fa-clock"></i>
                                    ${part}: 
                                    ${formatDate(dateInfo)}
                                </div>
                                <div class="log-book-date-item log-book-date-item__absent">
                                    <span>Vắng: ${absentees.length}</span>
                                    <i class="fa-solid fa-user-graduate"></i>
                                </div>
                            </div>
                            <div class="log-book-contents">
                                <div class="log-book-content-wrapper">
                                    <div class="log-book-content-lesson">
                                        <i class="fa-solid fa-book-open"></i>
                                        <span style="font-weight: 700">Nội dung:</span>
                                        ${content}
                                    </div>
                                </div>
                                <div class="log-book-content">
                                    <div class="log-book-content-wrapper">
                                        <div class="log-book-content-heading">
                                            <i class="fa-solid fa-bell"></i>
                                            Vắng có phép: ${
                                                absentWithPermission.length
                                            }
                                            <i class="fa-solid fa-user-graduate"></i>
                                        </div>
                                        <ul class="log-book-content-list">
                                            ${absentWithPermission
                                                .map(
                                                    (student, index) => `
                                                <li class="log-book-content-list-item">
                                                    ${index + 1}. ${
                                                        student.student_name
                                                    }
                                                    <span>- Lý do: ${
                                                        student.reason
                                                            ? student.reason
                                                            : "không có."
                                                    }</span>
                                                </li>
                                            `
                                                )
                                                .join("")}
                                        </ul>
                                    </div>
                                    <div class="log-book-content-wrapper">
                                        <div class="log-book-content-heading">
                                            <i class="fa-solid fa-bell-slash"></i>
                                            Vắng không phép: ${
                                                absentWithoutPermission.length
                                            }
                                            <i class="fa-solid fa-user-graduate"></i>
                                        </div>
                                        <ul class="log-book-content-list">
                                            ${absentWithoutPermission
                                                .map(
                                                    (student, index) => `
                                                <li class="log-book-content-list-item">
                                                    ${index + 1}. ${
                                                        student.student_name
                                                    }
                                                    <span>- Lý do: ${
                                                        student.reason
                                                            ? student.reason
                                                            : "không có."
                                                    }</span>
                                                </li>
                                            `
                                                )
                                                .join("")}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button class="delete-btn" onclick="handleDeleteClick(event, '${
                            url + "log-class/" + log_id
                        }', '${className}')">
                            <i class="fa-regular fa-trash-can error"></i>
                        </button>
                    </div>    
                `;

            // Tạo một phần tử DOM mới
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = logBookHtml;

            // Thêm phần tử này vào DOM bằng appendChild()
            element.appendChild(tempDiv);
        });
    }

    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    // SEARCH LOG BOOK
    elements.logBookSearchForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault(); // Ngăn không reload trang

            // Lấy giá trị từ các trường
            let logAt = document.getElementById("log-book-search__date").value;
            let classId = document.getElementById(
                "log-book-search__class-dropdown"
            ).value;
            let part = document.getElementById("log-book-search__part").value;
            const searchElement = document.getElementById("search-results");

            renderLogBook(
                searchElement,
                await fetchLogClassData({
                    date: logAt,
                    classId,
                    part,
                })
            );
        }
    );

    // WRITE LOG BOOK
    // Gán sự kiện "click" cho mỗi nút
    elements.logBookOptionBtns.forEach((button) => {
        button.addEventListener("click", () => {
            // Loại bỏ class "active" khỏi tất cả các nút
            elements.logBookOptionBtns.forEach((btn) =>
                btn.classList.remove("active")
            );

            // Thêm class "active" cho nút vừa được nhấn
            button.classList.add("active");

            // Hiển thị nội dung tương ứng dựa trên thuộc tính "name"
            const name = button.getAttribute("name");
            showLogBookContent(name);
        });
    });

    document
        .getElementById("log-book-write__absent")
        .addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

    /// Hiển thị gợi ý khi người dùng nhập vào trường input
    document
        .getElementById("log-book-write__absent")
        .addEventListener("input", function () {
            const query = this.value.toLowerCase();
            const suggestionsList = document.getElementById("suggestions-list");
            suggestionsList.innerHTML = "";

            if (
                !listFilteredStudentsByClassId ||
                listFilteredStudentsByClassId.length === 0
            ) {
                const messageItem = document.createElement("li");
                messageItem.textContent =
                    "Không tìm thấy học sinh vì bạn chưa chọn lớp học !";
                suggestionsList.appendChild(messageItem);
                return;
            }

            function removeVietnameseTones(str) {
                return str
                    .normalize("NFD") // Chuẩn hóa chuỗi về dạng ký tự kết hợp
                    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu tổ hợp
                    .replace(/đ/g, "d") // Đổi ký tự 'đ' thành 'd'
                    .replace(/Đ/g, "D"); // Đổi ký tự 'Đ' thành 'D'
            }

            // Cập nhật code để không phân biệt dấu
            if (query.length > 0) {
                const normalizedQuery = removeVietnameseTones(
                    query.toLowerCase()
                );
                const filteredStudents = listFilteredStudentsByClassId.filter(
                    (student) =>
                        removeVietnameseTones(
                            student.name.toLowerCase()
                        ).includes(normalizedQuery)
                );

                filteredStudents.forEach((student) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = student.name;
                    listItem.dataset.value = student.id;
                    listItem.addEventListener("click", function () {
                        addStudentToSelected(
                            this.textContent,
                            this.dataset.value
                        );
                        document.getElementById(
                            "log-book-write__absent"
                        ).value = "";
                        suggestionsList.innerHTML = "";
                    });
                    suggestionsList.appendChild(listItem);
                });
            }
        });

    // Thêm sinh viên vào danh sách đã chọn
    let absentCount = 0;
    function addStudentToSelected(name, id, absent, reason) {
        if (!selectedStudents.has(id)) {
            absentCount = absentCount + 1;
            selectedStudents.add(id);

            const selectedList = document.getElementById("selected-list");
            const listItem = document.createElement("li");
            const classes = "slide-in-right";

            // Escape dấu ngoặc kép trong chuỗi lý do (reason)
            const escapedReason = reason ? reason.replace(/"/g, "&quot;") : "";

            // Tạo phần tử HTML cho sinh viên
            listItem.innerHTML = `
                <div class="absent-wrapper ${classes}">
                    <div class="absent-wrapper-item absent-wrapper-item__name">
                        <i class="fa-solid fa-user-graduate"></i> ${name}
                    </div>
                    <div class="absent-wrapper-item">
                        <label class="permit-label" for="absent-permit-${id}">
                            <i class="fa-solid fa-bell"></i> CP
                        </label>
                        <input type="radio" name="absent-${id}" id="absent-permit-${id}" value="true" data-student-id="${id}" ${
                absent && "checked"
            } required>
                    </div>
                    <div class="absent-wrapper-item">
                        <label class="no-permit-label" for="absent-no-permit-${id}">
                            <i class="fa-solid fa-bell-slash"></i> KP
                        </label>
                        <input type="radio" name="absent-${id}" id="absent-no-permit-${id}" value="false" data-student-id="${id}" ${
                !absent && "checked"
            } required>
                    </div>
                    <button class="remove-btn" data-id="${id}">
                        <i class="fa-regular fa-trash-can error"></i>
                    </button>
                </div>
                <input
                    id="log-book-write__reason-${id}"
                    name="reason-${id}"
                    class="add-item-input form-select"
                    placeholder="Nhập lý do vắng học ..."
                    data-student-id="${id}"
                    value="${escapedReason}"
                />
                `;

            // Lấy các phần tử radio button và ô input lý do
            const permitRadio = listItem.querySelector(`#absent-permit-${id}`);
            const noPermitRadio = listItem.querySelector(
                `#absent-no-permit-${id}`
            );
            const reasonInput = listItem.querySelector(
                `#log-book-write__reason-${id}`
            );

            // Hàm cập nhật thuộc tính required của reasonInput
            function updateReasonRequired() {
                if (permitRadio.checked) {
                    reasonInput.setAttribute("required", "required");
                } else {
                    reasonInput.removeAttribute("required");
                }
            }

            // Thêm sự kiện lắng nghe thay đổi cho cả hai radio button
            permitRadio.addEventListener("change", updateReasonRequired);
            noPermitRadio.addEventListener("change", updateReasonRequired);

            // Gọi hàm cập nhật ban đầu để đảm bảo trạng thái required đúng
            updateReasonRequired();

            listItem
                .querySelector(".remove-btn")
                .addEventListener("click", function () {
                    removeStudentFromSelected(this.dataset.id);
                });
            selectedList.appendChild(listItem);
            updateAbsentCount(absentCount);
        } else {
            alert("Đã có " + name + " trong danh sách vắng !");
        }
    }

    function removeStudentCompletely(id) {
        // Xóa sinh viên khỏi Set
        selectedStudents.delete(id);
        absentCount = absentCount - 1;

        // Cập nhật lại số lượng học sinh vắng
        updateAbsentCount(absentCount);
    }

    function removeStudentFromSelected(id) {
        // Gọi hàm để xóa hoàn toàn sinh viên
        removeStudentCompletely(id);

        // Kiểm tra danh sách đã chọn để xóa phần tử từ DOM
        const selectedList = document.getElementById("selected-list");
        const studentItem = selectedList.querySelector(
            `.remove-btn[data-id="${id}"]`
        );

        // Kiểm tra xem phần tử có tồn tại trước khi xóa
        if (studentItem) {
            studentItem.closest("li").remove(); // Xóa phần tử khỏi DOM
        } else {
            console.warn("Student item not found in the selected list.");
        }
    }

    // Hàm cập nhật số lượng học sinh vắng
    function updateAbsentCount(absentCount) {
        const absentCountElement = document.querySelector(".absent-count");
        if (absentCountElement) {
            absentCountElement.innerHTML = absentCount || 0;
        }
    }

    // Ẩn danh sách gợi ý khi nhấp ra ngoài
    document.addEventListener("click", function (e) {
        if (
            !document
                .getElementById("log-book-write__absent")
                .contains(e.target)
        ) {
            document.getElementById("suggestions-list").innerHTML = "";
        }
    });

    // Hàm chuyển đổi ngày từ dd/mm/yyyy sang yyyy/mm/dd
    function convertDateFormat(dateString) {
        const parts = dateString.split("/");
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // yyyy-mm-dd
    }

    // Lấy các phần tử từ form
    const partElement = document.getElementById("log-book-write__part");
    const dateElement = document.getElementById("log-book-write__date");
    // Hàm gọi API và điền thông tin vào form
    async function fetchClassLogData() {
        const teacherElement = document.getElementById(
            "log-book-write__teacher"
        );
        const contentElement = document.getElementById(
            "log-book-write__content"
        );
        const selectedList = document.getElementById("selected-list");

        const part = partElement.value;
        const logAt = dateElement.value;
        const classId = elements.logBookWriteDropdown.value;

        // Kiểm tra nếu đủ điều kiện (tất cả trường đều được chọn)
        if (
            part &&
            part !== "undefined" &&
            part.trim() !== "" &&
            logAt &&
            logAt !== "undefined" &&
            logAt.trim() !== "" &&
            classId &&
            classId !== "undefined" &&
            classId.trim() !== ""
        ) {
            showLoadingModal();

            // Gọi API để lấy dữ liệu
            await fetch(
                url +
                    `log-class?log_at=${convertDateFormat(
                        logAt
                    )}&class_id=${classId}&part=${part}`
            )
                .then((response) => response.json())
                .then((data) => {
                    hideLoadingModal();
                    const logClass = data[0]; // Giả định chỉ có một kết quả

                    // Điền thông tin giáo viên
                    teacherElement.value = logClass ? logClass.teacher : "";
                    // Điền nội dung buổi học
                    contentElement.value = logClass ? logClass.content : "";

                    // Xóa danh sách cũ
                    selectedList.innerHTML = "";

                    // Làm rỗng selectedStudents trước khi thêm dữ liệu mới
                    selectedStudents.clear();

                    absentCount = 0;
                    updateAbsentCount(absentCount);
                    // Hiển thị danh sách học sinh vắng
                    logClass?.absentees?.forEach((absentStudent) => {
                        let reason = absentStudent.reason;
                        if (reason.includes('\\"')) {
                            reason = reason.replace(/\\"/g, '"');
                        }
                        addStudentToSelected(
                            absentStudent.student_name, // tên học sinh từ API
                            absentStudent.student_id, // id học sinh
                            absentStudent.absent,
                            absentStudent.reason
                        );
                    });
                })
                .catch((error) => {
                    console.error("Có lỗi xảy ra khi gọi API:", error);
                    alert("Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên !");
                });
        } else {
            // Điền thông tin giáo viên
            teacherElement.value = "";
            // Điền nội dung buổi học
            contentElement.value = "";

            // Xóa danh sách cũ
            selectedList.innerHTML = "";

            // Làm rỗng selectedStudents trước khi thêm dữ liệu mới
            selectedStudents.clear();
            updateAbsentCount(absentCount);
            document.getElementById("selected-list").innerHTML = "";
        }
    }

    // Lắng nghe sự kiện change trên các trường
    partElement.addEventListener("change", fetchClassLogData);
    dateElement.addEventListener("change", fetchClassLogData);
    elements.logBookWriteDropdown.addEventListener("change", fetchClassLogData);

    // Hàm xử lý sự kiện gửi form
    elements.logBookWrite.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn form gửi đi theo cách mặc định

        // Lấy dữ liệu từ các trường nhập liệu
        const classId = elements.logBookWriteDropdown.value;
        const teacher = document.getElementById(
            "log-book-write__teacher"
        ).value;
        const content = document.getElementById(
            "log-book-write__content"
        ).value;
        const part = document.getElementById("log-book-write__part").value;
        let logAt = document.getElementById("log-book-write__date").value;
        const countAbsent = selectedStudents.size;

        // Gọi API tạo log-class
        const logClassData = {
            class_id: classId,
            teacher: teacher,
            count_absent: countAbsent,
            content: content,
            part: part,
            log_at: convertDateFormat(logAt),
        };

        showLoadingModal();
        fetch(url + "log-class", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(logClassData),
        })
            .then((response) => response.json())
            .then((logClassResult) => {
                // Tạo mảng để gom dữ liệu học sinh vắng mặt
                const absentDataArray = [];

                // Duyệt qua tất cả các học sinh được chọn
                selectedStudents.forEach((studentId) => {
                    const absentRadio = document.querySelector(
                        `input[name="absent-${studentId}"]:checked`
                    );
                    const reasonInput = document.querySelector(
                        `#log-book-write__reason-${studentId}`
                    );
                    if (absentRadio && reasonInput) {
                        const absent = absentRadio.value === "true"; // Lấy giá trị absent từ radio button
                        const reason = reasonInput.value;

                        // Tạo đối tượng cho mỗi học sinh và thêm vào mảng
                        absentDataArray.push({
                            log_id: logClassResult.status,
                            class_id: classId,
                            student_id: studentId,
                            absent: absent,
                            reason: reason,
                            part: part,
                            absent_at: convertDateFormat(logAt),
                        });
                    }
                });

                // Gọi API /absent một lần với mảng dữ liệu
                fetch(url + "absent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(absentDataArray),
                })
                    .then(() => {
                        hideLoadingModal();
                        elements.logBookWrite.reset();
                        selectedStudents.clear();
                        document.querySelector(".absent-count").innerHTML =
                            selectedStudents.size || 0;
                        document.getElementById("selected-list").innerHTML = "";
                    })
                    .catch((error) => {
                        alert("Đã có lỗi sảy ra !");
                        console.error("Có lỗi khi tạo absent:", error);
                    });

                alert(logClassResult.title);
            })
            .catch((error) => {
                alert("Đã có lỗi sảy ra !");
                console.error("Có lỗi khi tạo log-class:", error);
            });
    });

    // Func lấy api log class
    async function fetchLogClassData(condition = {}) {
        const { date, classId, part } = condition;

        const params = new URLSearchParams({
            ...(date ? { log_at: date } : {}), // Thêm log_at nếu có giá trị hợp lệ
            ...(classId ? { class_id: classId } : {}), // Thêm class_id nếu có giá trị hợp lệ
            ...(part ? { part: part } : {}), // Thêm part nếu có giá trị hợp lệ
        });

        try {
            showLoadingModal();
            const response = await fetch(
                `${url}log-class?${params.toString()}`
            );
            const logClassData = await response.json();

            hideLoadingModal();

            // Kiểm tra kiểu dữ liệu
            if (!Array.isArray(logClassData)) {
                console.error(
                    "logClassData không phải là một mảng:",
                    logClassData
                );
                return [];
            }
            return logClassData;
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
            return [];
        }
    }

    // Lấy tất cả các nút trong div .rank-options
    const buttons = document.querySelectorAll(".rank-option-btn");

    // Lấy các bảng
    const absentTable = document.querySelector(".manager-rank-table__absent");
    const scoreTable = document.querySelector(".manager-rank-table__score");
    const absentDetailTable = document.querySelector("#absent-detail");
    const scoreDetailTable = document.querySelector("#score-detail");
    const defaultMessage = document.getElementById("default-message");

    // Lặp qua tất cả các nút và gắn sự kiện click
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            // Xóa lớp 'active' khỏi tất cả các nút
            buttons.forEach((btn) => btn.classList.remove("active"));

            // Thêm lớp 'active' cho nút được nhấn
            this.classList.add("active");

            // Gọi API tương ứng
            fetchStatistics();
        });
    });

    // Gắn sự kiện change cho dropdown
    document
        .querySelector("#rank-select-class")
        .addEventListener("change", function () {
            fetchStatistics();
        });

    // Hàm gọi API tương ứng với nút đang active
    function fetchStatistics() {
        const classId = document.querySelector("#rank-select-class").value; // Lấy classId từ select
        const activeButton = document.querySelector(".rank-option-btn.active"); // Lấy nút đang active

        absentDetailTable.style.display = "none";
        scoreDetailTable.style.display = "none";

        // Ẩn/hiện bảng dựa trên giá trị số
        if (activeButton) {
            const value = activeButton.getAttribute("data-value");

            if (value === "1") {
                absentTable.classList.remove("hidden");
                scoreTable.classList.add("hidden");
                fetchAbsenceStatistics(classId);
            } else if (value === "2") {
                scoreTable.classList.remove("hidden");
                absentTable.classList.add("hidden");
                fetchScoreStatistics(classId);
            }
        }

        const rankContent = document.querySelector(".rank-content");
        rankContent.style.display = "flex"; // Hiển thị bảng
        const rankSelect = document.querySelector(".rank-select");
        rankSelect.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống
    }

    // Hàm để gọi API và render bảng Vắng Học
    function fetchAbsenceStatistics(classId) {
        let path = url + `absence-statistics`;
        if (classId) {
            path += `?classId=${classId}`;
        }

        showLoadingModal();
        fetch(path)
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                return response.json();
            })
            .then((data) => {
                hideLoadingModal();
                const absentContainer = document.querySelector(
                    "#manager-rank-table__absent"
                );
                absentContainer.innerHTML = ""; // Xóa nội dung cũ

                if (data.length === 0) {
                    absentContainer.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align: center;">
                                <div class="no-data">
                                    <img class="no-data-img" src="access/images/no-data.jpeg" alt="No Data" style="animation: fadeIn 1s forwards;" />
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                let tableHTML = `
                    <table class="manager-rank-table manager-rank-table__absent">
                        <thead>
                            <colgroup class="colgroup">
                                <col style="width: 6%; max-width: 30px" />
                                <col style="width: 25%" />
                                <col style="width: 15%" />
                                <col style="width: 15%" />
                                <col style="width: 10%" />
                                <col style="width: 15%" />
                                <col style="width: 15%" />
                            </colgroup>
                            <tr>
                                <th scope="col" style="min-width: 30px"></th>
                                <th scope="col">Họ & Tên</th>
                                <th scope="col">Tên Lớp</th>
                                <th scope="col">Vắng</th>
                                <th scope="col">Có Phép</th>
                                <th scope="col">Không Phép</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.forEach((item, index) => {
                    tableHTML += `
                        <tr>
                            <td>${
                                index + 1 < 10 ? "0" + (index + 1) : index + 1
                            }</td>
                            <td>${item.student_name}</td>
                            <td>${item.classname}</td>
                            <td>${item.total_absent} buổi</td>
                            <td>${item.absent_true} buổi</td>
                            <td>${item.absent_false} buổi</td>
                            <td><button class="rank-table-detail-btn rank-table-absent-detail-btn" data-class-id="${
                                item.class_id
                            }" data-student-id="${
                        item.student_id
                    }">Chi tiết</button></td>
                        </tr>
                    `;
                });

                tableHTML += `</tbody></table>`;
                absentContainer.innerHTML = tableHTML;
            })
            .catch((error) =>
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                )
            );
    }

    // Hàm để gọi API và render bảng Điểm Số
    function fetchScoreStatistics(classId) {
        let path = url + `score-statistics`;
        if (classId) {
            path += `?classId=${classId}`;
        }

        showLoadingModal();
        fetch(path)
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                return response.json();
            })
            .then((data) => {
                hideLoadingModal();
                const scoreContainer = document.querySelector(
                    "#manager-rank-table__score"
                );
                scoreContainer.innerHTML = ""; // Xóa nội dung cũ

                if (data.length === 0) {
                    scoreContainer.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align: center;">
                                <div class="no-data">
                                    <img class="no-data-img" src="access/images/no-data.jpeg" alt="No Data" style="animation: fadeIn 1s forwards;" />
                                </div>
                            </td>
                        </tr>`;
                    return;
                }

                // Thêm tiêu đề cho bảng Điểm Số
                let tableHTML = `
                    <table class="manager-rank-table manager-rank-table__score">
                        <thead>
                            <colgroup class="colgroup">
                                <col style="width: 6.5%; max-width: 30px" />
                                <col style="width: 35%" />
                                <col style="width: 15%" />
                                <col style="width: 15%" />
                                <col style="width: 20%" />
                                <col style="width: 20%" />
                            </colgroup>
                            <tr>
                                <th scope="col" style="min-width: 30px"></th>
                                <th scope="col">Họ & Tên</th>
                                <th scope="col">Tên Lớp</th>
                                <th scope="col">Kiểm Tra</th>
                                <th scope="col">Điểm Trung&nbsp;Bình</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                data.forEach((item, index) => {
                    const averageScore =
                        item.average_score_percent !== undefined
                            ? item.average_score_percent === 100 ||
                              item.average_score_percent === 0
                                ? `${item.average_score_percent} %`
                                : item.average_score_percent.toFixed(2) + " %" // Làm tròn nếu không phải 0 hoặc 100
                            : "N/A";

                    tableHTML += `
                        <tr>
                            <td>${
                                index + 1 < 10 ? "0" + (index + 1) : index + 1
                            }</td>
                            <td>${item.student_name}</td>
                            <td>${item.classname}</td>
                            <td>${item.total_count_lesson} Bài</td>
                            <td>${averageScore}</td>
                            <td><button class="rank-table-detail-btn rank-table-score-detail-btn" data-class-id="${
                                item.class_id
                            }" data-student-id="${
                        item.student_id
                    }">chi tiết</button></td>
                        </tr>
                    `;
                });
                tableHTML += `</tbody></table>`;
                scoreContainer.innerHTML = tableHTML;
            })
            .catch((error) =>
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                )
            );
    }

    // DETAIL ABSENT
    // Hàm để gọi API và render bảng chi tiết vắng học
    function fetchAbsentRecords(classId, studentId) {
        absentDetailTable.style.display = "flex";
        scoreDetailTable.style.display = "none";
        let path = url + `records`;
        if (classId) {
            path += `?classId=${classId}`;
        }
        if (studentId) {
            path += `&studentId=${studentId}`;
        }

        showLoadingModal();
        fetch(path)
            .then((response) => {
                if (!response.ok)
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                return response.json();
            })
            .then((data) => {
                hideLoadingModal();

                // Cập nhật tên học sinh và lớp học
                document.querySelector(
                    "#absent-detail-student-name"
                ).textContent = data[0]?.student_name || "Tên học sinh";
                document.querySelector(
                    "#absent-detail-class-name"
                ).textContent = `Lớp: ${
                    data[0]?.classname || "Không xác định"
                }`;

                // Xóa nội dung cũ của bảng
                const tableBody = document.querySelector(
                    ".manager-rank-table__absent-detail"
                );
                tableBody.innerHTML = "";

                if (data.length === 0) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="5" style="text-align: center;">
                                Không có dữ liệu vắng học
                            </td>
                        </tr>`;
                    return;
                }

                // Tạo phần tiêu đề bảng
                let tableHTML = `
                    <thead>
                        <colgroup class="colgroup">
                            <col style="width: 5%" />
                            <col style="width: 30%" />
                            <col style="width: 15%" />
                            <col style="width: 15%" />
                            <col style="width: auto; text-align: left" />
                        </colgroup>
                        <tr>
                            <th scope="col" style="min-width: 30px"></th>
                            <th scope="col">Ngày Vắng</th>
                            <th scope="col">Buổi Học</th>
                            <th scope="col">Vắng</th>
                            <th scope="col">Lý do</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                // Render dữ liệu mới vào bảng
                data.forEach((item, index) => {
                    const absentType = item.absent ? "Có phép" : "Không phép";
                    tableHTML += `
                        <tr>
                            <td>${
                                index + 1 < 10 ? "0" + (index + 1) : index + 1
                            }</td>
                            <td>${formatShortDateTime(item.absent_at)}</td>
                            <td>${item.part}</td>
                            <td>${absentType}</td>
                            <td>${item.reason || "Không có lý do"}</td>
                        </tr>
                    `;
                });

                // Đóng bảng
                tableHTML += `</tbody>`;
                tableBody.innerHTML = tableHTML;

                const absentDetail = document.querySelector("#absent-detail");
                absentDetail.style.display = "flex"; // Hiển thị bảng
                absentDetail.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống
            })
            .catch((error) => {
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    }

    // SCORE DETAIL
    // Hàm chung để gọi API và xử lý dữ liệu
    function fetchScoreRecords(classId, studentId) {
        absentDetailTable.style.display = "none";
        scoreDetailTable.style.display = "flex";
        // Xác định đường dẫn API
        const path = `${url}${studentId}/scores?classId=${classId}`;

        // Hiển thị modal loading
        showLoadingModal();
        fetch(path)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                }
                return response.json();
            })
            .then((data) => {
                hideLoadingModal(); // Ẩn modal loading

                // Render bảng chi tiết điểm
                document.querySelector(
                    "#score-detail-student-name"
                ).textContent = data[0]?.student_name || "Tên học sinh";
                document.querySelector(
                    "#score-detail-class-name"
                ).textContent = `Lớp: ${
                    data[0]?.classname || "Không xác định"
                }`;

                // Xóa nội dung cũ của bảng
                const scoreTableBody = document.querySelector(
                    ".manager-rank-table__score-detail"
                );
                if (scoreTableBody) {
                    scoreTableBody.innerHTML = "";
                } else {
                    return;
                }

                // Thêm tiêu đề cho bảng
                const tableHeaderHTML = `
                    <colgroup class="colgroup">
                        <col style="width: 5%" />
                        <col style="width: auto" />
                        <col style="width: 15%" />
                        <col style="width: 15%" />
                        <col style="width: 15%" />
                    </colgroup>
                    <tr>
                        <th scope="col" style="min-width: 30px"></th>
                        <th scope="col">Tên Bài Kiểm Tra</th>
                        <th scope="col">Thang Điểm</th>
                        <th scope="col">Điểm</th>
                        <th scope="col">Tỷ lệ đúng</th>
                    </tr>
                `;
                scoreTableBody.innerHTML += tableHeaderHTML;

                if (data.length === 0) {
                    scoreTableBody.innerHTML += `
                        <tr>
                            <td colspan="5" style="text-align: center;">
                                Không có dữ liệu điểm
                            </td>
                        </tr>`;
                } else {
                    data.forEach((item, index) => {
                        const scorePercentage =
                            item.score_percentage === 100 ||
                            item.score_percentage === 0
                                ? `${item.score_percentage} %` // Hiển thị nguyên giá trị nếu là 0 hoặc 100
                                : `${item.score_percentage.toFixed(2)} %`; // Làm tròn nếu không phải 0 hoặc 100

                        const rowHTML = `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${handleLessonName(item.lesson)}</td>
                                <td>${item.max_score}</td>
                                <td>${item.score}</td>
                                <td>${scorePercentage}</td> <!-- Hiển thị tỷ lệ đúng -->
                            </tr>
                        `;
                        scoreTableBody.innerHTML += rowHTML;
                    });
                }

                // Hiển thị bảng và cuộn xuống
                const scoreDetail = document.querySelector("#score-detail");
                scoreDetail.style.display = "flex"; // Hiển thị bảng
                scoreDetail.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống
            })
            .catch((error) => {
                hideLoadingModal(); // Đảm bảo ẩn modal loading nếu có lỗi
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    }

    // Gán sự kiện click cho nút "Chi tiết" absent
    document.addEventListener("click", function (event) {
        if (event.target.matches(".rank-table-absent-detail-btn")) {
            const button = event.target;
            const classId = button.getAttribute("data-class-id");
            const studentId = button.getAttribute("data-student-id");

            // Gọi hàm fetchAbsentRecords khi nhấn nút "Chi tiết"
            fetchAbsentRecords(classId, studentId);
        }
    });

    // Gán sự kiện click cho nút "Chi tiết" score
    document.addEventListener("click", function (event) {
        if (event.target.matches(".rank-table-score-detail-btn")) {
            const button = event.target;
            const classId = button.getAttribute("data-class-id");
            const studentId = button.getAttribute("data-student-id");

            // Gọi hàm fetchAbsentRecords khi nhấn nút "Chi tiết"
            fetchScoreRecords(classId, studentId);
        }
    });

    function getAllStatistics() {
        fetch(url + "statistics")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Network response was not ok " + response.statusText
                    );
                }
                return response.json();
            })
            .then((data) => {
                const tbody = document.querySelector(
                    ".manager-rank-table-class tbody"
                );
                tbody.innerHTML = ""; // Xóa nội dung cũ

                data.forEach((item, index) => {
                    const averageScore =
                        item.average_score_percent === 100 ||
                        item.average_score_percent === 0
                            ? `${item.average_score_percent} %` // Hiển thị nguyên giá trị nếu là 0 hoặc 100
                            : `${item.average_score_percent.toFixed(2)} %`; // Làm tròn nếu không phải 0 hoặc 100

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${
                            index + 1 < 10 ? "0" + (index + 1) : index + 1
                        }</td>
                        <td>${item.classname}</td>
                        <td>${averageScore} <br /><span class="manager-rank-table-class__mobile">（ ${
                        item.total_lessons
                    } bài kiểm tra ）</span></td>
                        <td>${item.total_absent} lần</td>
                        <td>${item.total_log_class} bản ghi</td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch((error) =>
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                )
            );
    }

    async function showLogBookContent(name) {
        // Ẩn tất cả các phần tử nội dung
        elements.logBookToday.style.display = "none";
        elements.logBookSearch.style.display = "none";
        elements.logBookWrite.style.display = "none";

        // Hiển thị phần tử tương ứng với nút được nhấn
        if (name === "today") {
            renderLogBook(
                elements.logBookToday,
                await fetchLogClassData({
                    date: getTodayDate(),
                    classId: null,
                    part: null,
                    teacher: null,
                })
            );
            elements.logBookToday.style.display = "block";
        } else if (name === "search") {
            elements.logBookSearch.style.display = "block";
        } else if (name === "write") {
            elements.logBookWrite.style.display = "block";
        }
    }

    // Hàm khởi tạo dữ liệu
    async function initWindow() {
        try {
            await fetchClasses(); // Gọi hàm lấy các lớp
            const logToday = await fetchLogClassData({ date: getTodayDate() }); // Gọi hàm lấy dữ liệu log class
            renderLogBook(elements.logBookToday, logToday); // Hiển thị bảng log class
            initStudentList(); // Khởi tạo danh sách học sinh

            scoreTable.classList.add("hidden"); // Ẩn bảng điểm số
        } catch (error) {
            console.error("Có lỗi xảy ra khi khởi tạo log book:", error);
        }
    }
    function formatDate(dateString) {
        const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        const date = new Date(dateString);
        const day = daysOfWeek[date.getDay()];
        const dayOfMonth = String(date.getDate()).padStart(2, "0"); // Thêm số 0 ở phía trước nếu nhỏ hơn 10
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0, thêm số 0 ở phía trước
        const year = date.getFullYear();

        return `${day} ngày ${dayOfMonth} - ${month} - ${year}`;
    }
    function downloadPDF() {
        showLoadingModal();
        // Tạo nội dung cho bảng
        const tableBody = [
            [
                { text: "STT", style: "tableHeader", alignment: "center" },
                { text: "Họ và Tên", style: "tableHeader", alignment: "left" },
                {
                    text: "Giới Tính",
                    style: "tableHeader",
                    alignment: "center",
                },
                { text: "Lớp Học", style: "tableHeader", alignment: "center" },
                {
                    text: "Ngày Tham Gia",
                    style: "tableHeader",
                    alignment: "left",
                },
                {
                    text: "Check",
                    fontSize: 9,
                    style: "tableHeader",
                    alignment: "center",
                    margin: [0, 6],
                },
            ],
        ];

        // Lặp qua danh sách học sinh để thêm dữ liệu vào bảng
        filteredStudents.forEach((student, index) => {
            const row = [
                { text: index + 1, style: "tableHeader", alignment: "center" },
                { text: student.name, style: "tableBody", alignment: "left" },
                { text: student.sex, style: "tableBody", alignment: "center" },
                {
                    text: student.classname,
                    style: "tableBody",
                    alignment: "center",
                },
                {
                    text: formatDate(student.created_at),
                    style: "tableBody",
                    alignment: "left",
                },
                { text: "", alignment: "left" },
            ];
            tableBody.push(row);
        });

        var docDefinition = {
            header: function (currentPage, pageCount) {
                return {
                    text: `DANH SÁCH HỌC SINH${
                        filterClassName ? " LỚP " + filterClassName + " " : ""
                    }`,
                    style: "header",
                    alignment: "center",
                    margin: [0, 35, 0, 0], // Điều chỉnh margin cho phù hợp
                };
            },
            content: [
                {
                    table: {
                        headerRows: 1,
                        body: tableBody,
                        widths: ["auto", "*", "auto", "*", "*", "auto"],
                        layout: {
                            hLineColor: function () {
                                return "#ddd";
                            },
                            vLineColor: function () {
                                return "#ddd";
                            },
                            hLineWidth: function () {
                                return 1;
                            },
                            vLineWidth: function () {
                                return 1;
                            },
                        },
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 15,
                    bold: true,
                    color: "green",
                    margin: [0, 0, 0, 10],
                    alignment: "center",
                    fillColor: "green",
                },
                tableHeader: {
                    bold: true,
                    fontSize: 11,
                    color: "black",
                    margin: [2, 5],
                    fillColor: "#e9e9e9",
                },
                tableBody: {
                    fontSize: 10,
                    bold: false,
                    margin: [2, 5],
                    fillColor: "whitesmoke",
                },
            },
            defaultStyle: {
                font: "Roboto",
            },
            pageSize: "A4",
            pageMargins: [50, 60],
            footer: function (currentPage, pageCount) {
                return {
                    text: `Trang ${currentPage} / ${pageCount}`,
                    alignment: "center",
                    fontSize: 10,
                    margin: [0, 30, 0, 0],
                };
            },
        };
        hideLoadingModal();

        // Tạo PDF và mở trong tab mới
        pdfMake.createPdf(docDefinition).getBlob(function (blob) {
            const blobURL = URL.createObjectURL(blob);
            const fileName = `${
                filterClassName ? filterClassName + " " : ""
            }danh sách học sinh.pdf`;

            // Mở trong tab mới
            const newTab = window.open(blobURL, "_blank");

            // Tạo một nút "Download" trong trang mới để tải file với tên file mong muốn
            newTab.onload = function () {
                const downloadButton = newTab.document.createElement("a");
                downloadButton.href = blobURL;
                downloadButton.download = fileName;
                downloadButton.innerText = "Tải xuống PDF";
                downloadButton.style =
                    "font-size: 18px; position: absolute; top: 10px;border-radius:999px; right: 20px; padding: 10px 15px; background-color: green; color: white; text-decoration: none;";
                newTab.document.body.appendChild(downloadButton);
            };
        });
    }

    document
        .querySelector(".download-pdf-btn__list-students")
        .addEventListener("click", downloadPDF);

    // Gọi hàm khởi tạo
    initWindow();
});
