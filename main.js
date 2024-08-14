import url from "./url.js";

document.addEventListener("DOMContentLoaded", function (e) {
    // Lấy các phần tử DOM cần sử dụng
    const studentCountElement = document.getElementById("student-count");
    const lessonSelectElement = document.getElementById("lesson-select");

    // Định nghĩa các API endpoint

    const apiGetScore = url + "score-lesson";
    const apiGetMaxLesson = url + "max-lesson";

    let lessonValue = lessonSelectElement.value;

    // Hàm gọi API để lấy bài học lớn nhất
    async function getScoreApi() {
        await fetch(apiGetMaxLesson)
            .then((response) => {
                return response.json(); // Chuyển đổi phản hồi thành JSON
            })
            .then((datas) => {
                lessonValue = datas; // Lưu giá trị bài học lớn nhất
                lessonSelectElement.value = lessonValue; // Cập nhật giá trị của select element
                const data = {
                    classname: "N5 - 08",
                    lesson: lessonValue,
                };
                renderHtml(data); // Gọi hàm renderHtml với dữ liệu
            })
            .catch((error) => {
                console.error("Lỗi truy vấn dữ liệu get max lesson:", error);
            });
    }

    // Hàm render HTML dựa trên dữ liệu trả về từ API
    async function renderHtml(data) {
        // Xóa bảng cũ nếu có
        const tableWrapper = document.querySelector(".table-wrapper");
        const existingTable = tableWrapper.querySelector("table");
        if (existingTable) {
            tableWrapper.removeChild(existingTable);
        }

        // Xóa các span con trong các phần tử hiển thị top score, bottom score, và no test
        document
            .querySelectorAll(".rank-item-max span")
            .forEach((span) => span.remove());
        document
            .querySelectorAll(".rank-item-min span")
            .forEach((span) => span.remove());
        document
            .querySelectorAll(".rank-item-no-test span")
            .forEach((span) => span.remove());

        await fetch(apiGetScore, {
            method: "POST", // Sử dụng phương thức POST
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Chuyển đổi dữ liệu thành JSON string
        })
            .then((response) => response.json())
            .then((datas) => {
                // Lọc các điểm số không phải là 0
                const nonZeroScores = datas
                    .filter((item) => item.score > 0) // Lọc những điểm số lớn hơn 0
                    .map((item) => item.score); // Lấy chỉ điểm số

                // Tìm điểm số nhỏ nhất trong số các điểm đã lọc
                const minScore = Math.min(...nonZeroScores);
                const maxScore = datas[1].score;
                studentCountElement.innerHTML = datas.length;

                // Tạo bảng mới
                const table = document.createElement("table");
                table.className = "table table-hover border";
                table.style.width = "100%";

                // Tạo hàng tiêu đề
                const thead = document.createElement("thead");
                const headerRow = document.createElement("tr");
                headerRow.className = "table-light";

                // Thêm các tiêu đề cột vào hàng tiêu đề
                ["STT", "Họ và Tên", "Điểm", "Sai"].forEach((text) => {
                    const th = document.createElement("th");
                    th.textContent = text;
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Tạo phần thân bảng
                const tbody = document.createElement("tbody");

                let totalWrong = 0; // Biến để tính tổng số câu sai

                datas.forEach((data, index) => {
                    ++index;
                    const row = document.createElement("tr");
                    if (index < 10) {
                        index = `0${index}`;
                    }
                    [index, data.name, data.score, data.error].forEach(
                        (cellData) => {
                            const td = document.createElement("td");
                            td.textContent = cellData;
                            row.appendChild(td);
                        }
                    );

                    totalWrong += data.error; // Cộng thêm số câu sai vào tổng

                    tbody.appendChild(row);
                });

                // Thêm hàng mới vào cuối bảng để hiển thị tổng số câu sai
                const totalRow = document.createElement("tr");
                totalRow.className = "total-row";
                totalRow.innerHTML = `
                    <td colspan="3" style="text-align: right; font-weight: bold;">Tổng số câu sai:</td>
                    <td style="font-weight: bold;">${totalWrong}</td>
                `;
                tbody.appendChild(totalRow);

                table.appendChild(tbody);

                // Thêm bảng vào div với class 'table-wrapper'
                tableWrapper.appendChild(table);

                // Duyệt qua dữ liệu và thêm span cho các điểm số khác nhau
                datas.map((data, index) => {
                    // TOP SCORE
                    if ((data.score == maxScore) & (data.score != 0)) {
                        // Tạo thẻ span mới
                        const newSpan = document.createElement("span");
                        newSpan.textContent = `・❤️ ${data.name} (${data.score} đ)`;
                        newSpan.className =
                            "rank-item-name rank-item-name__max";

                        // Chọn phần tử có lớp rank-item-max
                        const rankItemDiv =
                            document.querySelector(".rank-item-max");

                        // Thêm thẻ span mới vào phần tử rank-item
                        rankItemDiv.appendChild(newSpan);
                    }

                    // BOTTOM SCORE
                    if (data.score == minScore) {
                        // Tạo thẻ span mới
                        const newSpan = document.createElement("span");
                        newSpan.textContent = `・🆘 ${data.name} (${data.score} đ)`;
                        newSpan.className =
                            "rank-item-name rank-item-name__min";

                        // Chọn phần tử có lớp rank-item-min
                        const rankItemDiv =
                            document.querySelector(".rank-item-min");

                        // Thêm thẻ span mới vào phần tử rank-item
                        rankItemDiv.appendChild(newSpan);
                    }

                    // NO TEST
                    if (data.score == 0) {
                        // Tạo thẻ span mới
                        const newSpan = document.createElement("span");
                        newSpan.textContent = `・${data.name}`;
                        newSpan.className =
                            "rank-item-name rank-item-name__no-test";

                        // Chọn phần tử có lớp rank-item-no-test
                        const rankItemDiv =
                            document.querySelector(".rank-item-no-test");

                        // Thêm thẻ span mới vào phần tử rank-item
                        rankItemDiv.appendChild(newSpan);
                    }
                });
            });
    }

    // Hàm khởi chạy ứng dụng
    function app() {
        getScoreApi(); // Gọi API để lấy dữ liệu và render HTML
    }
    app(); // Chạy ứng dụng
});

// Hàm xử lý khi thay đổi bài học
handleChangeLesson = function (value) {
    const data = {
        classname: "N5 - 08",
        lesson: value,
    };
    renderHtml(data);
};
