const NoteIndexPage: SSRPage = () => {
  return null
}

NoteIndexPage.loadData = async (ctx) => {
  return {
    redirect: '/notes/latest',
  }
}
export default NoteIndexPage
