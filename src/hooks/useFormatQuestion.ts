export default (question: string) => {
    return question.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;')
}