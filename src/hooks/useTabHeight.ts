export default (discount: number) => {
    const height = document.documentElement.clientHeight
    return `${height - discount}px`
}