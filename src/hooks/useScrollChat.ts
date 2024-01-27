export default () => {
    const el = document.querySelector('.conversation-views .el-scrollbar__wrap')
    el?.scrollTo(0, el.scrollHeight)
}