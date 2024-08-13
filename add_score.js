document.addEventListener("DOMContentLoaded", function () {
    // URL của API cung cấp danh sách sinh viên
    const allStudentApi = "https://staff-333-api.herokuapp.com/api/students";

    // Hàm để lấy dữ liệu từ API và tạo bảng sinh viên
    async function loadStudents() {
        try {
            const response = await fetch(allStudentApi);
            const students = await response.json();

            const table = document.getElementById("student-table");
            const studentCount = document.getElementById("student-count");
            let rows = "";

            students.forEach((student, index) => {
                rows += `
                <tr>
                    <td><input class="input-disable input-stt" type="number" name="stt[]" value="${
                        index + 1
                    }" readonly /></td>
                    <td><input class="input-disable" type="text" name="name[]" value="${
                        student.name
                    }" readonly /></td>
                    <td><input class="score-input" type="number" name="score[]" max="50"/></td>
                </tr>`;
            });

            table.innerHTML += rows;
            studentCount.textContent = students.length;
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    }

    // Gọi hàm để load sinh viên khi trang được tải
    loadStudents();
});
document
    .getElementById("score-form")
    .addEventListener("submit", async function (event) {
        event.preventDefault();
        alert("Ấn ok để xử lý dữ liệu...");

        const lesson = document.querySelector('select[name="lesson"]').value;
        const names = document.querySelectorAll('input[name="name[]"]');
        const scores = document.querySelectorAll('input[name="score[]"]');
        const insertScoreApi = "https://staff-333-api.herokuapp.com/api/score";

        // Tạo mảng dữ liệu từ các trường nhập liệu
        const data = [];
        names.forEach((nameInput, index) => {
            const studentData = {
                lesson: lesson,
                name: nameInput.value,
                score: scores[index].value,
            };
            data.push(studentData);
        });
        console.log(data);

        try {
            await fetch(insertScoreApi, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => response.text())
                .then((text) => alert(text));
        } catch (error) {
            console.error("Error submitting scores:", error);
            // Xử lý lỗi, ví dụ, hiển thị thông báo lỗi cho người dùng
        }
    });
