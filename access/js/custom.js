flatpickr("#log-book-write__date", {
    dateFormat: "d/m/Y",
    defaultDate: "today",
    locale: flatpickr.l10ns.vn, // sử dụng ngôn ngữ đã định nghĩa
    allowInput: true,
});

const scrollToTopBtn = document.getElementById("scroll-to-top-btn");
scrollToTopBtn.addEventListener("click", () => scrollToTop());
// Hàm xử lý sự kiện cuộn
window.onscroll = function () {
    toggleScrollToTopBtn();
};

// Hàm để hiển thị/ẩn nút "Lên đầu trang"
function toggleScrollToTopBtn() {
    if (document.documentElement.scrollTop > window.innerHeight * 0.4) {
        scrollToTopBtn.style.transform = "translateX(0px)"; // Hiển thị nút
    } else {
        scrollToTopBtn.style.transform = "translateX(120px)"; // Ẩn nút
    }
}

// Hàm cuộn lên đầu trang
function scrollToTop() {
    document.documentElement.scrollTop = 0; // Dành cho Chrome, Firefox, IE và Opera
    document.body.scrollTop = 0; // Dành cho Safari
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// // Vô hiệu hóa chuột phải
// document.addEventListener("contextmenu", function (event) {
//     event.preventDefault();
// });

// // Vô hiệu hóa F12 (và một số phím khác)
// document.addEventListener("keydown", function (event) {
//     if (
//         event.key === "F12" ||
//         (event.ctrlKey && event.shiftKey && event.key === "I") ||
//         (event.ctrlKey && event.shiftKey && event.key === "J") ||
//         (event.ctrlKey && event.key === "U")
//     ) {
//         event.preventDefault();
//     }
// });
