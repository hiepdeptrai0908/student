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

    const tableWrapper = document.querySelector("table");

    const timeOut = 100;
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
        } else if (["ADMINN"].includes(loginInputValue)) {
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
    document.addEventListener("DOMContentLoaded", function () {
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
    function optionScreen(
        optionValue = localStorage.getItem("manager-option-value") || "1"
    ) {
        if (optionValue === "7") {
            getAllStatistics();
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

        return `${dayOfWeek} ${day} - ${month} - ${year}`;
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
            return `Minano Nihongo: Bài ${lessonNumber - 300 - 1} → Bài ${
                lessonNumber - 300
            }`;
        } else if (lessonNumber >= 400 && lessonNumber < 500) {
            return `Minano Nihongo: Bài ${lessonNumber - 400 - 4} → Bài ${
                lessonNumber - 400
            }`;
        } else if (lessonNumber >= 500 && lessonNumber < 600) {
            return `Look And Learn: Bài ${lessonNumber - 500 - 4} → Bài ${
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
    // Lấy dữ liệu lớp học và hiển thị ra table class
    async function fetchClassData() {
        try {
            showLoadingModal();
            const response = await fetch(url + "class");
            const data = await response.json();
            setTimeout(() => {
                hideLoadingModal();
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
                        </tr>
                    `;
                    })
                    .join("");
            }, timeOut);
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
        }
    }

    // Lấy danh sách lớp học để điền vào dropdown
    async function fetchClasses() {
        try {
            const response = await fetch(url + "class");
            const data = await response.json();

            // CLASS dropdown
            elements.oldClassDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            elements.deleteClassDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Student dropdown
            elements.oldStudentDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            elements.updateStudentDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            elements.deleteStudentDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Table student dropdown
            elements.tableStudentDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Insert score - class dropdown
            elements.insertScoreClassDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Delete score - class dropdown
            elements.deleteScoreClassDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Screen score - class dropdown
            elements.screenScoreClassDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Log book write - class dropdown
            elements.logBookWriteDropdown.innerHTML =
                '<option value="">-- Chọn Lớp Học --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Log book search - class dropdown
            elements.logBookSearchClassDropdown.innerHTML =
                '<option value="">-- Tất cả --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
                    .join("");
            // Rank select - class dropdown
            elements.rankSelectClass.innerHTML =
                '<option value="">-- Tất cả --</option>' +
                data
                    .map(
                        (item) =>
                            `<option value="${item.id}">${item.classname}</option>`
                    )
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
                fetchClassData();
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
            fetchClassData();
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
                        fetchClassData();
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
    async function addStudent(classId, name) {
        try {
            showLoadingModal();
            const response = await fetch(url + "student", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ class_id: classId, name }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.text();
            setTimeout(() => {
                hideLoadingModal();
                alert(result);
                document.getElementById("add-student-form").reset();
            }, timeOut);

            fetchClassData();
            fetchClasses();
            // Thực hiện các hành động sau khi thêm thành công, ví dụ: cập nhật danh sách học sinh
            // fetchStudents(); // Nếu có hàm fetchStudents để lấy danh sách học sinh
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

            const classDropdown = document.getElementById(
                "old-student-dropdown"
            );
            const classId = classDropdown.value;
            const name = document.getElementById("name").value.trim();

            if (classId && name) {
                // Gọi hàm thêm học sinh mới
                addStudent(classId, name);
            } else {
                alert("Vui lòng chọn lớp học và nhập họ tên học sinh.");
            }
        });

    // SỬA ĐIỂM HỌC SINH
    // Hàm để lấy danh sách học sinh của lớp học từ API và cập nhật vào dropdown
    async function fetchStudentsByClass(classId) {
        try {
            showLoadingModal();
            const response = await fetch(`${url}class/${classId}/students`);
            const students = await response.json();
            setTimeout(() => {
                hideLoadingModal();
                const studentSelect = document.getElementById("student-select");
                const tableStudentSelect = document.getElementById(
                    "table-student-select"
                );

                // Hàm cập nhật tùy chọn học sinh cho dropdown
                function updateStudentOptions(selectElement, students) {
                    let optionsHtml =
                        '<option value="">-- Chọn Học Sinh --</option>';

                    students.forEach((student) => {
                        optionsHtml += `
                                <option value="${student.id}">${student.name}</option>
                            `;
                    });
                    selectElement.innerHTML = optionsHtml;
                }

                renderLesson(classId);

                updateStudentOptions(studentSelect, students);
                updateStudentOptions(tableStudentSelect, students);

                // Cập nhật tùy chọn cho cả hai dropdown
            }, timeOut);
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách học sinh:", error);
        }
    }

    // Hàm gọi API để lấy dữ liệu điểm mới và chú thích
    async function fetchScoreData(class_id, student_id, lesson) {
        try {
            showLoadingModal();
            document.getElementById("new-score").value = "";
            document.getElementById("comment").value = "";
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

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setTimeout(() => {
                hideLoadingModal();
                elements.showMaxScoreUpdate.textContent = `${data[0].max_score} đ`;
                document.getElementById("new-score").max =
                    data[0].max_score || "50";
                document.getElementById("new-score").value =
                    data[0].score || "";
                document.getElementById("comment").value =
                    data[0].comment || "";
            }, timeOut);
        } catch (error) {
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
            fetchClassData();
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

    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh ở update
    document
        .getElementById("update-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            if (classId) {
                fetchStudentsByClass(classId);
            } else {
                const studentSelect = document.getElementById("student-select");
                studentSelect.innerHTML =
                    '<option value="">-- Chọn Học Sinh --</option>'; // Xóa các tùy chọn hiện tại
            }
        });

    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh ở table
    document
        .getElementById("table-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            if (classId) {
                fetchStudentsByClass(classId);
            } else {
                const studentSelect = document.getElementById(
                    "table-student-select"
                );
                studentSelect.innerHTML =
                    '<option value="">-- Chọn Học Sinh --</option>'; // Xóa các tùy chọn hiện tại
            }
        });

    let selectedStudents = new Set();
    let studentDataInClass = []; // Danh sách sinh viên trong lớp
    let studentToRemoved = []; // Danh sách sinh viên bị xóa
    // Xử lý khi chọn lớp học để viết sổ đầu bài
    elements.logBookWriteDropdown.addEventListener("change", async function () {
        const classId = this.value;
        if (classId) {
            showLoadingModal();
            await fetch(url + `class/${classId}/students`)
                .then((response) => response.json())
                .then((data) => {
                    hideLoadingModal();
                    studentDataInClass = data;
                });
        } else {
            studentDataInClass = [];
        }
    });
    // DELETE Student
    // Hàm để lấy danh sách học sinh của lớp học từ API và cập nhật vào dropdown
    async function fetchStudentsForDeletion(classId) {
        try {
            const response = await fetch(url + `class/${classId}/students`);
            const students = await response.json();

            const studentSelect = document.getElementById(
                "delete-student-select"
            );
            studentSelect.innerHTML =
                '<option value="">-- Chọn Học Sinh --</option>'; // Xóa các tùy chọn hiện tại

            students.forEach((student) => {
                const option = document.createElement("option");
                option.value = student.id; // ID học sinh
                option.textContent = student.name; // Tên học sinh
                studentSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Có lỗi xảy ra khi lấy danh sách học sinh:", error);
        }
    }

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
            fetchClassData();
            fetchClasses();
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

    // Xử lý khi chọn lớp học để cập nhật danh sách học sinh
    document
        .getElementById("delete-student-dropdown")
        .addEventListener("change", function () {
            const classId = this.value;
            if (classId) {
                fetchStudentsForDeletion(classId);
            } else {
                const studentSelect = document.getElementById(
                    "delete-student-select"
                );
                studentSelect.innerHTML =
                    '<option value="">-- Chọn Học Sinh --</option>'; // Xóa các tùy chọn hiện tại
            }
        });
    // Cập nhật bảng
    const tbody = document
        .getElementById("student-score-table")
        .getElementsByTagName("tbody")[0];
    const row = document.createElement("tr");
    row.innerHTML = `
                        <td colspan="6" class="text-center">Chưa chọn học sinh</td>
                    `;
    tbody.appendChild(row);
    async function renderTableScoreStudent(
        classId = elements.tableStudentDropdown.value,
        studentId = elements.tableStudentDropdown.value
    ) {
        // Gửi yêu cầu API để lấy dữ liệu bảng điểm
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
            // Lấy phần thân của bảng
            const tbody = document
                .getElementById("student-score-table")
                .getElementsByTagName("tbody")[0];

            // Xóa tất cả các hàng cũ trước khi thêm dữ liệu mới
            tbody.innerHTML = "";

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

                    // Format date
                    const daysOfWeek = [
                        "Chủ Nhật",
                        "Thứ Hai",
                        "Thứ Ba",
                        "Thứ Tư",
                        "Thứ Năm",
                        "Thứ Sáu",
                        "Thứ Bảy",
                    ];
                    const createdAt = new Date(score.created_at);
                    const dayOfWeek = daysOfWeek[createdAt.getDay()];
                    const formattedDate = `${dayOfWeek}<br />${String(
                        createdAt.getDate()
                    ).padStart(2, "0")}-${String(
                        createdAt.getMonth() + 1
                    ).padStart(2, "0")}-${createdAt.getFullYear()}`;
                    row.innerHTML = `
                        <td>${formattedIndex}</td>
                        <td width="100px">${handleLessonName(score.lesson)}</td>
                        <td width="45px">${score.max_score}</td>
                        <td width="45px">${score.score}</td>
                        <td style="font-style:italic; color:#333; font-size:12px; text-align:left;" ${
                            score.comment == "Chưa đóng phạt" ||
                            score.comment == "chưa đóng phạt" ||
                            score.comment == "Chưa đóng tiền" ||
                            score.comment == "chưa đóng tiền" ||
                            score.comment == "Vắng" ||
                            score.comment == "vắng"
                                ? `class="error"`
                                : `class=""`
                        }>${score.comment}</td>
                        <td width="120px">${formattedDate}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        }, timeOut);
    }

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

    // Nhập điểm
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
                for (let i = 1; i <= 5; i++) {
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
    // Chọn nội dung kiểm tra
    function handleInputMaxScore() {
        insertMaxScore = this.value;
        const insertScoreElement =
            document.querySelectorAll(".max-score_input");
        for (let i = 0; i < insertScoreElement.length; i++) {
            insertScoreElement[i].max = insertMaxScore;
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
        const response = await fetch(`${url}class/${classId}/students`);
        const students = await response.json();

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

    // score form submit
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

                scoresData.push({
                    student_id: Number(studentId),
                    class_id: Number(classId),
                    lesson: Number(lesson),
                    lesson_name: handleLessonName(lesson),
                    max_score: insertMaxScore,
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
                                    ${formatShortDateTime(dateInfo)}
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

            if (!studentDataInClass || studentDataInClass.length === 0) {
                const messageItem = document.createElement("li");
                messageItem.textContent =
                    "Không tìm thấy học sinh vì bạn chưa chọn lớp học !";
                suggestionsList.appendChild(messageItem);
                return;
            }

            if (query.length > 0) {
                const filteredStudents = studentDataInClass.filter((student) =>
                    student.name.toLowerCase().includes(query)
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
        absentCount = absentCount + 1;
        if (!selectedStudents.has(id)) {
            selectedStudents.add(id);

            // Lưu thông tin học sinh trước khi xóa
            const student = studentDataInClass.find(
                (student) => student.id === parseInt(id)
            );
            if (student) {
                studentToRemoved.push(student); // Thêm học sinh vào mảng
                studentDataInClass = studentDataInClass.filter(
                    (student) => student.id !== parseInt(id)
                );
            }

            const selectedList = document.getElementById("selected-list");
            const listItem = document.createElement("li");
            const classes = "slide-in-right";
            listItem.innerHTML = `
                <div class="absent-wrapper ${"slide-in-right"}">
                    <div class="absent-wrapper-item absent-wrapper-item__name">
                        <i class="fa-solid fa-user-graduate"></i> ${name}
                    </div>
                    <div class="absent-wrapper-item">
                        <label class="permit-label" for="absent-permit-${id}">
                            <i class="fa-solid fa-bell"></i> CP
                        </label>
                        <input type="radio" name="absent-${id}" id="absent-permit-${id}" value="true" data-student-id="${id}" ${
                absent == true ? "checked" : ""
            } required>
                    </div>
                    <div class="absent-wrapper-item">
                        <label class="no-permit-label" for="absent-no-permit-${id}">
                            <i class="fa-solid fa-bell-slash"></i> KP
                        </label>
                        <input type="radio" name="absent-${id}" id="absent-no-permit-${id}" value="false" data-student-id="${id}" ${
                absent == false ? "checked" : ""
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
                    value="${reason ? reason : ""}"
                />
                `;

            listItem
                .querySelector(".remove-btn")
                .addEventListener("click", function () {
                    removeStudentFromSelected(this.dataset.id);
                });
            selectedList.appendChild(listItem);
            updateAbsentCount(absentCount);
        }
    }

    function removeStudentCompletely(id) {
        // Xóa sinh viên khỏi Set
        selectedStudents.delete(id);
        absentCount = absentCount - 1;

        // Xóa sinh viên khỏi studentDataInClass
        studentDataInClass = studentDataInClass.filter(
            (student) => student.id !== id
        );

        // Xóa sinh viên khỏi studentToRemoved
        studentToRemoved = studentToRemoved.filter(
            (student) => student.id !== id
        );

        // Cập nhật lại số lượng học sinh vắng
        updateAbsentCount(absentCount);
    }

    function removeStudentFromSelected(id) {
        console.log("Before removal:", selectedStudents);

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
        rankContent.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống
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
                        <td>${averageScore} <br />（ ${
                        item.total_lessons
                    } bài kiểm tra ）</td>
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
            elements.logBookToday.style.display = "block";
            renderLogBook(
                elements.logBookToday,
                await fetchLogClassData({
                    date: getTodayDate(),
                    classId: null,
                    part: null,
                    teacher: null,
                })
            );
        } else if (name === "search") {
            elements.logBookSearch.style.display = "block";
        } else if (name === "write") {
            elements.logBookWrite.style.display = "block";
        }
    }

    // Hàm khởi tạo dữ liệu
    async function initLogBook() {
        try {
            await fetchClassData(); // Gọi hàm lấy dữ liệu lớp
            await fetchClasses(); // Gọi hàm lấy các lớp
            const logClassData = await fetchLogClassData({
                date: getTodayDate(),
                classId: null,
                part: null,
                teacher: null,
            }); // Gọi hàm lấy dữ liệu log class
            renderLogBook(elements.logBookToday, logClassData); // Hiển thị bảng log class

            // Khởi tạo: Ẩn bảng điểm số và chỉ hiển thị bảng vắng học
            scoreTable.classList.add("hidden");
        } catch (error) {
            console.error("Có lỗi xảy ra khi khởi tạo log book:", error);
        }
    }

    // Gọi hàm khởi tạo
    initLogBook();

    console.log("Tất cả tài nguyên đã được tải!");
});
