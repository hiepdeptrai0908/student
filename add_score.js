import url from "./url.js";

document.addEventListener("DOMContentLoaded", function () {
    // URL của API cung cấp danh sách sinh viên
    const allStudentApi = url + "students";
    const apiDeleteLesson = url + "delete-lesson";

    // Lấy các phần tử HTML cần sử dụng
    const deleteScoreLessonForm = document.getElementById(
        "delete-score-lesson"
    );
    const classnameInput = document.getElementById("classname-update");

    // Hàm để lấy dữ liệu từ API và tạo bảng sinh viên
    async function loadStudents(classname = classnameInput.value) {
        try {
            // Gửi yêu cầu GET tới API để lấy danh sách sinh viên theo lớp
            const response = await fetch(allStudentApi + `/${classname}`, {
                method: "GET",
            });
            const students = await response.json(); // Chuyển đổi dữ liệu nhận được thành JSON

            const table = document.getElementById("student-table");
            const studentCount = document.getElementById("student-count");

            // Nếu không có dữ liệu, hiển thị thông báo "không có dữ liệu"
            if (students.length === 0) {
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ & Tên</th>
                            <th>Điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="3" class="text-center">Không có dữ liệu</td>
                        </tr>
                    </tbody>`;
                studentCount.textContent = "0"; // Cập nhật số lượng sinh viên là 0
                return;
            }

            let rows = ""; // Chuỗi để lưu trữ các hàng của bảng

            // Tạo từng hàng của bảng với dữ liệu sinh viên
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

            table.innerHTML = `
                <thead>
                    <tr class="table-light">
                        <th>STT</th>
                        <th>Họ & Tên</th>
                        <th>Điểm</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>`; // Chèn các hàng vào bảng cùng với phần tiêu đề

            studentCount.textContent = students.length; // Cập nhật số lượng sinh viên
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    }

    // Gọi hàm loadStudents khi trang được tải
    loadStudents();

    // Xử lý sự kiện gửi biểu mẫu để cập nhật điểm
    document
        .getElementById("score-form")
        .addEventListener("submit", async function (event) {
            event.preventDefault();
            alert("Ấn ok để xử lý dữ liệu...");

            const lesson = document.querySelector(
                'select[name="lesson"]'
            ).value;
            const names = document.querySelectorAll('input[name="name[]"]');
            const scores = document.querySelectorAll('input[name="score[]"]');
            const insertScoreApi =
                "https://staff-333-api.herokuapp.com/api/score";

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
                // Gửi yêu cầu POST tới API để lưu điểm
                await fetch(insertScoreApi, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.text())
                    .then((text) => alert(text));
            } catch (error) {
                console.error("Error submitting scores:", error);
            }
        });

    // Hàm xóa lesson dựa trên tên bài học
    async function deleteLesson(lesson) {
        try {
            // Gửi yêu cầu DELETE tới API để xóa bài học
            const response = await fetch(apiDeleteLesson, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lesson }),
            });

            const message = await response.text(); // Chuyển đổi phản hồi thành văn bản
            alert(message); // Hiển thị thông báo phản hồi từ server
            deleteScoreLessonForm.reset(); // Reset form sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xoá lesson:", error);
        }
    }

    // Xử lý sự kiện gửi biểu mẫu xóa lesson
    deleteScoreLessonForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const lesson = document.getElementById("lesson").value;
        deleteLesson(lesson);
    });

    // Cập nhật danh sách học sinh khi lớp học thay đổi
    classnameInput.addEventListener("change", function () {
        const classname = classnameInput.value;
        loadStudents(classname); // Gọi lại hàm loadStudents với lớp học mới
    });
});
