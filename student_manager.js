document.addEventListener("DOMContentLoaded", function () {
    // Định nghĩa các API endpoint

    const apiGetAllStudents =
        "https://staff-333-api.herokuapp.com/api/students";
    const apiInsertStudent = "https://staff-333-api.herokuapp.com/api/student";
    const apiUpdateScore = "https://staff-333-api.herokuapp.com/api/score";

    // const apiGetAllStudents = "http://localhost:8888/api/students";
    // const apiInsertStudent = "http://localhost:8888/api/student";
    // const apiUpdateScore = "http://localhost:8888/api/score";

    const addStudentForm = document.getElementById("add-student-form");
    const updateScoreForm = document.getElementById("update-score-form");
    const studentSelect = document.getElementById("student-select");

    // Hàm tải danh sách học sinh từ API
    async function loadStudents() {
        try {
            const response = await fetch(apiGetAllStudents);
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
    async function updateScore(name, lesson, score) {
        try {
            const response = await fetch(apiUpdateScore, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    classname: "N5 - 08",
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
        if (name) {
            updateScore(name, lesson, score);
        } else {
            alert("Vui lòng chọn học sinh.");
        }
    });

    function capitalizeFirstLetter(string) {
        // Tách chuỗi thành mảng các từ
        return (
            string
                .split(" ")
                // Chuyển đổi từng từ thành chữ hoa chữ cái đầu tiên
                .map(
                    (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                // Gộp các từ lại thành chuỗi
                .join(" ")
        );
    }

    // Tải danh sách học sinh khi trang được tải
    loadStudents();
});
