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
        scrollToTopBtn.style.transform = "translateX(0)"; // Hiển thị nút
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
