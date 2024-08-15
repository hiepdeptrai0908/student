import url from "./url.js";

document.addEventListener("DOMContentLoaded", function () {
    const allStudentApi = url + "students";
    const apiDeleteLesson = url + "delete-lesson";

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
    let formToSubmit;

    async function loadStudents(classname = classnameInput.value) {
        try {
            const response = await fetch(`${allStudentApi}/${classname}`);
            const students = await response.json();

            const table = document.getElementById("student-table");
            const studentCount = document.getElementById("student-count");

            // Xóa nội dung bảng trước khi cập nhật
            table.innerHTML = "";

            if (students.length === 0) {
                // Tạo bảng mới
                table.className = "table table-hover border";
                table.style.width = "100%";

                // Tạo hàng tiêu đề
                const thead = document.createElement("thead");
                const headerRow = document.createElement("tr");
                headerRow.className = "table-light";

                ["STT", "Họ và Tên", "Điểm"].forEach((text) => {
                    const th = document.createElement("th");
                    th.textContent = text;
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Tạo phần thân bảng với thông báo không có dữ liệu
                const tbody = document.createElement("tbody");
                const noDataRow = document.createElement("tr");
                noDataRow.innerHTML =
                    '<td colspan="3" class="text-center"><b>Lớp này không có học sinh nào!</b><br /><span style="font-style: italic; opacity: 0.8;">(Chú ý xác nhận lại đúng tên lớp không: <br />kể cả viết hoa hoặc dấu cách!)</span></td>';
                tbody.appendChild(noDataRow);
                table.appendChild(tbody);

                studentCount.textContent = "0";
                return;
            }

            // Tạo các hàng bảng với dữ liệu sinh viên
            let rows = students
                .map((student, index) => {
                    const stt = (index + 1).toString().padStart(2, "0");
                    return `
                <tr>
                    <td>${stt}</td>
                    <td>${student.name}</td>
                    <td><input class="score-input" type="number" name="score[]" max="50" /></td>
                </tr>`;
                })
                .join("");

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

    loadStudents();

    document
        .getElementById("score-form")
        .addEventListener("submit", function (event) {
            event.preventDefault();
            formToSubmit = this;
            confirmModal.show();
        });

    document
        .getElementById("delete-score-lesson")
        .addEventListener("submit", function (event) {
            document.querySelector(".info-lesson").textContent =
                document.querySelector("#lesson-delete").value;
            document.querySelector(".info-classname").textContent =
                document.querySelector("#classname-delete").value;
            event.preventDefault();
            formToSubmit = this;
            confirmDeleteModal.show();
        });

    document
        .getElementById("confirm-submit")
        .addEventListener("click", async function () {
            confirmModal.hide();
            try {
                const classname =
                    document.querySelector("#classname-update").value;
                const lesson = document.querySelector(
                    'select[name="lesson"]'
                ).value;
                const names = document.querySelectorAll("td:nth-child(2)");
                const scores = document.querySelectorAll(
                    'input[name="score[]"]'
                );
                const insertScoreApi = url + "score";

                const data = Array.from(names).map((nameInput, index) => ({
                    classname,
                    lesson: lesson,
                    name: nameInput.textContent,
                    score: scores[index].value,
                }));

                await fetch(insertScoreApi, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
                    .then((response) => response.text())
                    .then((text) => alert(text));
            } catch (error) {
                console.error("Lỗi khi gửi dữ liệu điểm:", error);
            }
        });

    document
        .getElementById("confirm-delete-submit")
        .addEventListener("click", async function () {
            confirmDeleteModal.hide();
            try {
                const lesson = document.getElementById("lesson-delete").value;
                const classname =
                    document.getElementById("classname-delete").value;

                await fetch(apiDeleteLesson, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ classname, lesson }),
                })
                    .then((response) => response.text())
                    .then((text) => alert(text));
            } catch (error) {
                console.error("Lỗi khi xoá bảng điểm:", error);
            }
        });

    classnameInput.addEventListener("input", function () {
        loadStudents(classnameInput.value);
    });
});
