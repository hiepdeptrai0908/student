import url from "./url.js";

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử DOM cần sử dụng
    const studentCountElement = document.getElementById("student-count");
    const lessonSelectElement = document.getElementById("lesson-select");
    const classnameInputElement = document.getElementById("classname-input");
    const scoreCreatedAtElement = document.getElementById("score-created-at");

    // Định nghĩa các API endpoint
    const apiGetScore = url + "score-lesson";
    const apiGetMaxLesson = url + "max-lesson";

    // Lấy giá trị mặc định của bài học và lớp học
    let lessonValue = lessonSelectElement.value;
    let classnameValue = classnameInputElement.value;

    // Hàm định dạng ngày tháng
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

        return `${hours}:${minutes} ${dayOfWeek}, ngày ${day} tháng ${month} năm ${year}`;
    }

    // Hàm gọi API để lấy bài học lớn nhất
    async function getScoreApi() {
        try {
            const response = await fetch(
                apiGetMaxLesson + `/${classnameValue}`,
                {
                    method: "GET",
                }
            );
            const datas = await response.json();
            lessonValue = datas;
            lessonSelectElement.value = lessonValue;
            const data = {
                classname: classnameValue,
                lesson: lessonValue,
            };
            renderHtml(data);
        } catch (error) {
            console.error("Lỗi truy vấn dữ liệu get max lesson:", error);
        }
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

        try {
            const response = await fetch(apiGetScore, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const datas = await response.json();

            // Xác định thời gian điểm được tạo từ dữ liệu đầu tiên (hoặc thay đổi logic nếu cần)
            if (datas.length > 0) {
                const createdAt = datas[0].created_at; // Lấy giá trị created_at từ dữ liệu đầu tiên
                scoreCreatedAtElement.textContent = formatDateTime(createdAt);
            } else {
                scoreCreatedAtElement.textContent = "Không có dữ liệu";
            }

            // Lọc các điểm số không phải là 0
            const nonZeroScores = datas
                .filter((item) => item.score > 0)
                .map((item) => item.score);

            // Tìm điểm số nhỏ nhất và lớn nhất
            const minScore = Math.min(...nonZeroScores);
            const maxScore = Math.max(...nonZeroScores);
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

            let totalWrong = 0;

            datas.forEach((data, index) => {
                const row = document.createElement("tr");
                const rowIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;
                [rowIndex, data.name, data.score, data.error].forEach(
                    (cellData) => {
                        const td = document.createElement("td");
                        td.textContent = cellData;
                        row.appendChild(td);
                    }
                );

                totalWrong += data.error;
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

            tableWrapper.appendChild(table);

            // Duyệt qua dữ liệu và thêm span cho các điểm số khác nhau
            datas.forEach((data) => {
                if (data.score === maxScore && data.score !== 0) {
                    const newSpan = document.createElement("span");
                    newSpan.textContent = `・❤️ ${data.name} （ ${data.score} điểm ）`;
                    newSpan.className = "rank-item-name rank-item-name__max";
                    document
                        .querySelector(".rank-item-max")
                        .appendChild(newSpan);
                }

                if (data.score === minScore) {
                    const newSpan = document.createElement("span");
                    newSpan.textContent = `・🆘 ${data.name} （ ${data.score} điểm ）`;
                    newSpan.className = "rank-item-name rank-item-name__min";
                    document
                        .querySelector(".rank-item-min")
                        .appendChild(newSpan);
                }

                if (data.score === 0) {
                    const newSpan = document.createElement("span");
                    newSpan.textContent = `・🤷‍♂️ ${data.name}`;
                    newSpan.className =
                        "rank-item-name rank-item-name__no-test";
                    document
                        .querySelector(".rank-item-no-test")
                        .appendChild(newSpan);
                }
            });

            // Hiển thị thông báo nếu không có dữ liệu
            if (datas.length === 0) {
                const noDataMessage = document.createElement("p");
                noDataMessage.textContent = "No data available";
                noDataMessage.style.textAlign = "center";
                tableWrapper.appendChild(noDataMessage);
            }
        } catch (error) {
            console.error("Lỗi truy vấn dữ liệu:", error);
        }
    }

    // Hàm xử lý khi thay đổi bài học
    function handleChangeLesson() {
        lessonValue = lessonSelectElement.value;
        const data = {
            classname: classnameValue,
            lesson: lessonValue,
        };
        renderHtml(data);
    }

    // Hàm xử lý khi thay đổi lớp
    function handleChangeClassname() {
        classnameValue = classnameInputElement.value;
        const data = {
            classname: classnameValue,
            lesson: lessonValue,
        };
        renderHtml(data);
    }

    // Thêm sự kiện khi thay đổi bài học
    lessonSelectElement.addEventListener("change", handleChangeLesson);

    // Thêm sự kiện khi thay đổi lớp
    classnameInputElement.addEventListener("input", handleChangeClassname);

    // Gọi API khi tải trang lần đầu
    getScoreApi();
});
