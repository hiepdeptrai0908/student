import url from "../url.js";
/* -------------------------------------------------------------------------------------------------------------------------------- */
// TRANG ADMIN
const elements = {
    wrapper: document.querySelector(".wrapper"),
    managerOption: document.getElementById("manager-option"),
    managerCoreTable: document.querySelector(".manager-core-table"),
    managerClass: document.querySelector(".manager-class"),
    managerStudent: document.querySelector(".manager-student"),
    managerInsertCore: document.querySelector(".manager-insert-core"),
    studentCountElement: document.getElementById("student-count"),
    lessonSelectElement: document.getElementById("lesson-select"),
    classnameInputElement: document.getElementById("classname-input"),
    scoreCreatedAtElement: document.getElementById("score-created-at"),
    modalOverlay: document.querySelector(".modal-overlay"),
    loginInput: document.querySelector(".modal-login-input"),
    loginBtn: document.querySelector(".btn-login"),
    imageNotFound: document.querySelector(".image-not-found"),
    oldClassDropdown: document.getElementById("old-class-dropdown"),
    deleteClassDropdown: document.getElementById("delete-class-dropdown"),
    oldStudentDropdown: document.getElementById("old-student-dropdown"),
    updateStudentDropdown: document.getElementById("update-student-dropdown"),
    deleteStudentDropdown: document.getElementById("delete-student-dropdown"),
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
    updateScoreLessonDropdown: document.getElementById("lesson"),
    showMaxScoreUpdate: document.getElementById("show-max-score__update"),
    showMaxScoreStudent: document.getElementById("show-max-score__student"),
    showMaxScoreTable: document.getElementById("show-max-score__table"),
};

const timeOut = 300;
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
        toggleVisibility(
            [elements.wrapper],
            [
                elements.managerOption,
                elements.managerClass,
                elements.managerStudent,
                elements.managerInsertCore,
            ]
        );
    } else if (["ADMINN", "AKAMARU", "DONGMINH"].includes(loginInputValue)) {
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
            ]
        );
    } else {
        alert("Giá trị nhập không hợp lệ. Vui lòng thử lại.");
    }
}

// Xử lý thay đổi giá trị nhập trong ô đăng nhập
function handleChangeLoginInput(event) {
    elements.loginBtn.value = event.target.value.trim().toUpperCase();
}

// Xử lý màn hình tùy chọn quản lý
function optionScreen(optionValue) {
    const optionMap = {
        1: [elements.managerCoreTable],
        2: [elements.managerClass],
        3: [elements.managerStudent],
        4: [elements.managerInsertCore],
    };

    Object.keys(optionMap).forEach((key) => {
        if (key == optionValue) {
            toggleVisibility(
                optionMap[key],
                [
                    elements.managerCoreTable,
                    elements.managerClass,
                    elements.managerStudent,
                    elements.managerInsertCore,
                ].filter((el) => !optionMap[key].includes(el))
            );
        }
    });

    localStorage.setItem("manager-option-value", optionValue);
}

// Xử lý thay đổi lựa chọn của quản lý
function handleManagerOptionChange(e) {
    optionScreen(e.target.value);
}

// Gán các sự kiện cho các phần tử
elements.managerOption.addEventListener("change", handleManagerOptionChange);
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

// Format tên bài học
function handleLessonName(lessonNumber) {
    if (lessonNumber < 100) {
        return `Từ Vựng Bài ${lessonNumber}`;
    } else if (lessonNumber >= 100 && lessonNumber < 200) {
        return `Ngữ Pháp Bài ${lessonNumber - 100}`;
    } else if (lessonNumber >= 200 && lessonNumber < 300) {
        return `Hán Tự Bài ${lessonNumber - 200}`;
    } else if (lessonNumber >= 300 && lessonNumber < 400) {
        return `Kiểm Tra Bài ${lessonNumber - 300 - 4} - ${lessonNumber - 300}`;
    } else if (lessonNumber >= 400 && lessonNumber < 500) {
        return `JLPT Lần ${lessonNumber - 400}`;
    }
}

async function showCoreTable(data) {
    // Xóa bảng cũ nếu có
    const tableWrapper = document.querySelector("table");

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
        elements.showMaxScoreTable.textContent = `${datas[0].max_score} đ`;
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
                <th>STT</th>
                <th>Họ và Tên</th>
                <th width="45px">Điểm</th>
                <th width="45px">Sai</th>
                <th>Chú thích</th>
            </tr>
        `;
        table.appendChild(thead);

        // Tạo phần thân bảng
        const tbody = document.createElement("tbody");
        let totalWrong = 0;

        datas.forEach((item, index) => {
            const rowIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;
            tbody.innerHTML += `
                <tr>
                    <td>${rowIndex}</td>
                    <td style="min-width:150px; text-align:left;">${
                        item.name
                    }</td>
                    <td>${item.score}</td>
                    <td>${item.error}</td>
                    <td style="font-style:italic; color:#333; font-size:10px; text-align:left;" ${
                        item.comment == "Chưa đóng phạt" ||
                        item.comment == "chưa đóng phạt" ||
                        item.comment == "Chưa đóng tiền" ||
                        item.comment == "chưa đóng tiền"
                            ? `class="error"`
                            : `class=""`
                    }>${item.comment}</td>
                </tr>
            `;
            totalWrong += item.error;
        });

        // Thêm hàng mới vào cuối bảng để hiển thị tổng số câu sai
        tbody.innerHTML += `
            <tr class="total-row">
                <td text-align="center" colspan="5" style="font-weight: bold;">TỔNG SỐ CÂU SAI: ${totalWrong}</td>
            </tr>
        `;

        table.appendChild(tbody);
        tableWrapper.appendChild(table);

        // Duyệt qua dữ liệu và thêm span cho các điểm số khác nhau
        datas.forEach((item) => {
            if (item.score === maxScore && item.score !== 0) {
                const newSpan = document.createElement("span");
                newSpan.textContent = `・🥇 ${item.name} （ ${item.score} điểm ）`;
                newSpan.className = "rank-item-name rank-item-name__max";
                document.querySelector(".rank-item-max").appendChild(newSpan);
            }

            if (item.score === minScore && minScore !== 0) {
                const newSpan = document.createElement("span");
                newSpan.textContent = `・💸 ${item.name} （ ${item.score} điểm ）`;
                newSpan.className = "rank-item-name rank-item-name__min";
                document.querySelector(".rank-item-min").appendChild(newSpan);
            }

            if (item.score === 0 && maxScore !== 0) {
                const newSpan = document.createElement("span");
                newSpan.textContent = `・🤷‍♂️ ${item.name}`;
                newSpan.className = "rank-item-name rank-item-name__no-test";
                document
                    .querySelector(".rank-item-no-test")
                    .appendChild(newSpan);
            }
        });
    }, 1000);
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

        const classId = document.getElementById("delete-class-dropdown").value;

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

// Viết hoa chữ cái đầu của từng từ và cập nhật giá trị của trường input
inputField.addEventListener("input", () => {
    const value = inputField.value;
    inputField.value = capitalizeFirstLetterOfEachWord(value);
});
function capitalizeFirstLetterOfEachWord(str) {
    return str
        .split(" ") // Chia chuỗi thành mảng các từ
        .map((word) => {
            // Viết hoa chữ cái đầu và giữ nguyên các chữ cái còn lại
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
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

        const classDropdown = document.getElementById("old-student-dropdown");
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
        console.log(data);
        setTimeout(() => {
            hideLoadingModal();
            elements.showMaxScoreUpdate.textContent = `${data[0].max_score} đ`;
            elements.showMaxScoreStudent.textContent = `${data[0].max_score} đ`;
            document.getElementById("new-score").max =
                data[0].max_score || "50";
            document.getElementById("new-score").value = data[0].score || "";
            document.getElementById("comment").value = data[0].comment || "";
        }, 250);
    } catch (error) {
        console.error("Error fetching score data:", error);
    }
}

// Hàm xử lý thay đổi giá trị của student-select
function handleStudentSelectChange() {
    const class_id = document.getElementById("update-student-dropdown").value;
    const student_id = document.getElementById("student-select").value;
    const lesson = document.getElementById("lesson").value;

    if (class_id && student_id && lesson != 0) {
        fetchScoreData(Number(class_id), Number(student_id), Number(lesson));
    }
}

// Hàm để gửi yêu cầu POST cập nhật điểm học sinh
async function updateScore(
    studentId,
    classId,
    lesson,
    score,
    comment,
    lessonName
) {
    try {
        showLoadingModal();
        const response = await fetch(url + "score", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id: studentId,
                class_id: classId,
                lesson,
                lesson_name: lessonName,
                score,
                comment,
            }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.text();
        setTimeout(() => {
            hideLoadingModal();
            alert(result);
            // reset lại table sau khi sửa điểm
            document.getElementById("update-score-form").reset();
        }, timeOut);
        fetchClassData();
        fetchClasses();
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
        const score = document.getElementById("new-score").value.trim();
        const comment = document.getElementById("comment").value.trim();

        if (classId && studentId && lesson && score) {
            // Gọi hàm cập nhật điểm học sinh
            updateScore(studentId, classId, lesson, score, comment, lessonName);
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
// DELETE Student
// Hàm để lấy danh sách học sinh của lớp học từ API và cập nhật vào dropdown
async function fetchStudentsForDeletion(classId) {
    try {
        const response = await fetch(url + `class/${classId}/students`);
        const students = await response.json();

        const studentSelect = document.getElementById("delete-student-select");
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
                const formattedIndex = (index + 1).toString().padStart(2, "0");

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
                ).padStart(2, "0")}-${String(createdAt.getMonth() + 1).padStart(
                    2,
                    "0"
                )}-${createdAt.getFullYear()}`;
                row.innerHTML = `
                    <td>${formattedIndex}</td>
                    <td width="100px">${handleLessonName(score.lesson)}</td>
                    <td width="45px">${score.max_score}</td>
                    <td width="45px">${score.score}</td>
                    <td style="font-style:italic; color:#333; font-size:10px; text-align:left;" ${
                        score.comment == "Chưa đóng phạt" ||
                        score.comment == "chưa đóng phạt" ||
                        score.comment == "Chưa đóng tiền" ||
                        score.comment == "chưa đóng tiền"
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
        const classId = document.getElementById("table-student-dropdown").value;
        const studentId = this.value;

        if (classId && studentId) {
            renderTableScoreStudent(classId, studentId);
        }
    });

// Nhập điểm
let insertMaxScore = document.getElementById("insert-score__max-score").value;
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
        lessonDropdown.innerHTML = '<option value="">-- Chọn Bài --</option>';

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
            for (let i = 1; i <= 50; i += 5) {
                options += `<option value="${i + 4 + 300}">${handleLessonName(
                    i + 4 + 300
                )}</option>`;
            }
            lessonDropdown.innerHTML += options;
        } else if (selectedValue === 4) {
            for (let i = 1; i <= 5; i++) {
                options += `<option value="${i + 400}">${handleLessonName(
                    i + 400
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
    const insertScoreElement = document.querySelectorAll(".max-score_input");
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
            console.log(insertMaxScore);
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
            console.log(scoresData);
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
    renderLesson(classId);
});

// DELETE SCORE LESSON
elements.deleteScoreClassDropdown.addEventListener("change", function () {
    const classId = this.value;
    renderLesson(classId);
});

function renderLesson(classId) {
    if (classId) {
        fetch(`${url}class/${classId}`)
            .then((response) => response.json())
            .then((datas) => {
                // Xóa các tùy chọn cũ
                elements.deleteScoreLessonDropdown.innerHTML =
                    '<option value="">-- Chọn Bài --</option>';

                // Thêm các tùy chọn mới
                datas.forEach((data) => {
                    const option = document.createElement("option");
                    option.value = data.lesson; // Hoặc trường dữ liệu thích hợp
                    option.textContent = `${handleLessonName(data.lesson)}`; // Hoặc trường dữ liệu thích hợp
                    elements.deleteScoreLessonDropdown.appendChild(option);
                });

                // Xóa các tùy chọn cũ
                elements.screenScoreLessonDropdown.innerHTML =
                    '<option value="">-- Chọn Bài --</option>';

                // Thêm các tùy chọn mới
                datas.forEach((data) => {
                    const option = document.createElement("option");
                    option.value = data.lesson; // Hoặc trường dữ liệu thích hợp
                    option.textContent = `${handleLessonName(data.lesson)}`; // Hoặc trường dữ liệu thích hợp
                    elements.screenScoreLessonDropdown.appendChild(option);
                });

                // FORM UPDATE ĐIỂM
                // Xóa các tùy chọn cũ
                elements.updateScoreLessonDropdown.innerHTML =
                    '<option value="">-- Chọn Bài --</option>';

                // Thêm các tùy chọn mới
                datas.forEach((data) => {
                    const option = document.createElement("option");
                    option.value = data.lesson; // Hoặc trường dữ liệu thích hợp
                    option.textContent = `${handleLessonName(data.lesson)}`; // Hoặc trường dữ liệu thích hợp
                    elements.updateScoreLessonDropdown.appendChild(option);
                });
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
                    setTimeout(() => {
                        hideLoadingModal();
                        renderLesson(classId);
                        alert(message); // Thông báo thành công nếu xoá điểm thành công
                        // Thực hiện các hành động tiếp theo nếu cần, ví dụ như làm mới bảng điểm
                    }, timeOut);
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

// Gọi hàm để lấy dữ liệu ban đầu
fetchClassData();
fetchClasses();
