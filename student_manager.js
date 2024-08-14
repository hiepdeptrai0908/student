import url from "./url.js";

document.addEventListener("DOMContentLoaded", function () {
    // Định nghĩa các API endpoint
    const apiGetAllStudents = url + "students";
    const apiInsertStudent = url + "student";
    const apiUpdateScore = url + "score";
    const apiDeleteStudent = url + "student";

    const addStudentForm = document.getElementById("add-student-form");
    const updateScoreForm = document.getElementById("update-score-form");
    const deleteStudentForm = document.getElementById("delete-student-form");
    const studentSelect = document.getElementById("student-select");
    const classnameInput = document.getElementById("classname-update");

    // Hàm tải danh sách học sinh từ API
    async function loadStudents(classname = classnameInput.value) {
        try {
            const response = await fetch(apiGetAllStudents + `/${classname}`, {
                method: "GET",
            });
            const students = await response.json();

            // Xóa tất cả các tùy chọn hiện tại
            studentSelect.innerHTML =
                '<option value="">-- Chọn Học Sinh --</option>';

            // Thêm các tùy chọn mới vào phần tử select
            students.forEach((student) => {
                const option = document.createElement("option");
                option.value = student.name;
                option.textContent = student.name;
                studentSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách học sinh:", error);
        }
    }

    // Hàm thêm học sinh mới
    async function addStudent(name, classname) {
        const capitalizeFirstLetterName = capitalizeFirstLetter(name);
        try {
            await fetch(apiInsertStudent, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: capitalizeFirstLetterName,
                    classname,
                }),
            })
                .then((response) => response.text())
                .then((message) => {
                    alert(message);
                    loadStudents(); // Tải lại danh sách học sinh sau khi thêm
                    addStudentForm.reset();
                });
        } catch (error) {
            console.error("Có lỗi xảy ra khi thêm học sinh.", error);
        }
    }

    // Hàm cập nhật điểm học sinh
    async function updateScore(name, classname, lesson, score) {
        try {
            await fetch(apiUpdateScore, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    classname,
                    name,
                    lesson,
                    score,
                }),
            })
                .then((response) => response.text())
                .then((message) => {
                    alert(message);
                    updateScoreForm.reset();
                });
        } catch (error) {
            console.error("Lỗi khi cập nhật điểm:", error);
        }
    }

    // Hàm xóa học sinh
    async function deleteStudent(name, classname) {
        try {
            await fetch(apiDeleteStudent, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    classname,
                }),
            })
                .then((response) => response.text())
                .then((message) => {
                    alert(message);
                    loadStudents(); // Tải lại danh sách học sinh sau khi xóa
                    deleteStudentForm.reset();
                });
        } catch (error) {
            console.error("Lỗi khi xóa học sinh:", error);
        }
    }

    // Xử lý sự kiện gửi biểu mẫu thêm học sinh
    addStudentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const classname = document.getElementById("classname").value;
        addStudent(name, classname);
    });

    // Xử lý sự kiện gửi biểu mẫu cập nhật điểm
    updateScoreForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = studentSelect.value;
        const lesson = document.getElementById("lesson").value;
        const score = document.getElementById("new-score").value;
        const classname = document.getElementById("classname-update").value;

        if (name && lesson && score) {
            updateScore(name, classname, lesson, score);
        } else {
            alert("Vui lòng điền đầy đủ thông tin.");
        }
    });

    // Xử lý sự kiện gửi biểu mẫu xóa học sinh
    deleteStudentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("delete-name").value;
        const classname = document.getElementById("delete-classname").value;

        if (
            confirm(
                `Bạn có chắc chắn muốn xóa học sinh ${capitalizeFirstLetter(
                    name
                )} khỏi lớp ${classname}?`
            )
        ) {
            deleteStudent(capitalizeFirstLetter(name), classname);
        }
    });

    // Xử lý sự kiện khi thay đổi tên lớp trong form cập nhật điểm
    classnameInput.addEventListener("input", function () {
        loadStudents();
    });

    // Hàm viết hoa chữ cái đầu tiên của tên

    function capitalizeFirstLetter(name) {
        return name
            .toLowerCase() // Chuyển toàn bộ chuỗi về chữ thường
            .split(" ") // Tách chuỗi thành mảng các từ
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Viết hoa chữ cái đầu tiên của mỗi từ
            .join(" "); // Nối các từ lại thành chuỗi
    }

    // Tải danh sách học sinh khi trang được tải lần đầu
    loadStudents();
});
