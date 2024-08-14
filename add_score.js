import url from "./url.js";

document.addEventListener("DOMContentLoaded", function () {
    // URL của API cung cấp danh sách sinh viên và API xóa bài học
    const allStudentApi = url + "students";
    const apiDeleteLesson = url + "delete-lesson";

    // Lấy các phần tử HTML cần sử dụng
    const deleteScoreLessonForm = document.getElementById(
        "delete-score-lesson"
    );
    const classnameInput = document.getElementById("classname-update");
    const confirmModal = new bootstrap.Modal(
        document.getElementById("confirm-modal")
    );
    const confirmDeleteModal = new bootstrap.Modal(
        document.getElementById("confirm-delete-modal")
    );
    let formToSubmit; // Biến lưu trữ biểu mẫu cần gửi

    // Hàm để lấy dữ liệu từ API và tạo bảng sinh viên
    async function loadStudents(classname = classnameInput.value) {
        try {
            // Gửi yêu cầu GET tới API để lấy danh sách sinh viên theo lớp
            const response = await fetch(`${allStudentApi}/${classname}`);
            const students = await response.json();

            const table = document.getElementById("student-table");
            const studentCount = document.getElementById("student-count");

            // Nếu không có dữ liệu, hiển thị thông báo "không có dữ liệu"
            if (students.length === 0) {
                table.innerHTML = `
                    <tbody>
                        <tr>
                        <tr>
                            <td colspan="3" class="text-center">Không có dữ liệu</td>
                        </tr>
                    </tbody>`;
                studentCount.textContent = "0";
                return;
            }

            // Tạo các hàng bảng với dữ liệu sinh viên
            let rows = students
                .map((student, index) => {
                    const stt = (index + 1).toString().padStart(2, "0"); // Đảm bảo STT có 2 chữ số
                    return `
                    <tr>
                        <td>${stt}</td>
                        <td>${student.name}</td>
                        <td><input class="score-input" type="number" name="score[]" max="50" /></td>
                    </tr>`;
                })
                .join("");

            // Cập nhật nội dung bảng và số lượng sinh viên
            table.innerHTML = `
                <thead>
                    <tr class="table-light">
                        <th>STT</th>
                        <th>Họ và Tên</th>
                        <th>Điểm</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>`;
            studentCount.textContent = students.length;
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
        }
    }

    // Gọi hàm loadStudents khi trang được tải
    loadStudents();

    // Xử lý sự kiện gửi biểu mẫu để xác nhận và gửi dữ liệu
    document
        .getElementById("score-form")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Ngăn chặn hành động gửi mặc định của biểu mẫu
            formToSubmit = this; // Lưu trữ biểu mẫu cần gửi
            confirmModal.show(); // Hiển thị modal xác nhận
        });

    document
        .getElementById("delete-score-lesson")
        .addEventListener("submit", function (event) {
            document.querySelector(".info-lesson").textContent =
                document.querySelector("#lesson-delete").value;
            document.querySelector(".info-classname").textContent =
                document.querySelector("#classname-delete").value;
            event.preventDefault(); // Ngăn chặn hành động gửi mặc định của biểu mẫu
            formToSubmit = this; // Lưu trữ biểu mẫu cần gửi
            confirmDeleteModal.show(); // Hiển thị modal xác nhận
        });

    // Xử lý khi người dùng nhấn nút "Xác Nhận" trong modal xác nhận
    document
        .getElementById("confirm-submit")
        .addEventListener("click", async function () {
            confirmModal.hide();
            try {
                const lesson = document.querySelector(
                    'select[name="lesson"]'
                ).value;
                const names = document.querySelectorAll("td:nth-child(2)"); // Lấy tên sinh viên từ bảng
                const scores = document.querySelectorAll(
                    'input[name="score[]"]'
                ); // Lấy điểm sinh viên từ bảng
                const insertScoreApi = url + "score";

                // Tạo mảng dữ liệu từ các trường nhập liệu
                const data = Array.from(names).map((nameInput, index) => ({
                    lesson: lesson,
                    name: nameInput.textContent,
                    score: scores[index].value,
                }));

                // Gửi yêu cầu POST tới API để lưu điểm
                await fetch(insertScoreApi, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.text())
                    .then((text) => alert(text)); // Hiển thị thông báo phản hồi từ server
            } catch (error) {
                console.error("Lỗi khi gửi dữ liệu điểm:", error);
            }
        });

    // Xử lý khi người dùng nhấn nút "Xác Nhận" trong modal xoá điểm
    document
        .getElementById("confirm-delete-submit")
        .addEventListener("click", async function () {
            confirmDeleteModal.hide();
            try {
                const lesson = document.getElementById("lesson-delete").value;
                const classname =
                    document.getElementById("classname-delete").value;

                // Gửi yêu cầu POST tới API để xoá điểm
                await fetch(apiDeleteLesson, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ classname, lesson }),
                })
                    .then((response) => response.text())
                    .then((text) => alert(text)); // Hiển thị thông báo phản hồi từ server
            } catch (error) {
                console.error("Lỗi khi xoá bảng điểm:", error);
            }
        });

    // Cập nhật danh sách sinh viên khi lớp học thay đổi
    classnameInput.addEventListener("change", function () {
        loadStudents(classnameInput.value); // Gọi lại hàm loadStudents với lớp học mới
    });
});
