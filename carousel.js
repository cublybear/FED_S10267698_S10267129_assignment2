let index = 0;
function showSlide() {
    const carousel = document.getElementById('carousel');
    carousel.style.transform = `translateX(${-index * 100}%)`;
}
function prevSlide() {
    index = (index > 0) ? index - 1 : 2;
    showSlide();
}
function nextSlide() {
    index = (index < 2) ? index + 1 : 0;
    showSlide();
}
