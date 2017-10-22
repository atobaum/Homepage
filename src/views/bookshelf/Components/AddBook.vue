<template lang="pug">
    .ui.modal.small.segment
        .header
            span 책 추가하기
            button.ui.small.basic.button.right.floated(type="button")
                i.remove.icon
            .ui.message.hidden
                .header
                p
        form.content.ui.form.compact#manual_book_form(method = "POST" action="", onsubmit="return manualSelectBook();")
            .field
                label 제목
                input(type='text' name="title" required)
            .field
                label 저자

                .ui.action.input#manual_authors
                    .ui.multiple.search.selection.dropdown
                        input(type="hidden")
                        .default.text 저자 추가하기
                    .ui.selection.dropdown.compact#manual_author_type
                        input(type='hidden')
                        i.dropdown.icon
                        .default.text
                        .menu
                            .item(data-value='1' value="author") 저자
                            .item(data-value='2' value="translator") 역자
                            .item(data-value='3' value="editor") 엮음
                            .item(data-value='4' value="supervisor") 감수
                            .item(data-value='5' value="illustrator") 그림
                            .item(data-value='6' value="photo") 사진
                    button.ui.button
                        i.add.user.icon
            .fields
                .field
                    label 출판사
                    input(type='text' name="publisher" required)
                .field
                    label 출판일
                    input(type='date' name="published_date" required)
            .field
                label ISBN
                input(type='text' pattern="\\d{10}|\\d{13}" name="isbn" maxlength=13 required)
            h3.ui.dividing.header 추가사항
            .field
                label 커버 이미지
                input(type='url' name="cover_URL" )
            .field
                label 원제목
                input(type='text' name="original_title" )
            .field
                label 페이지
                input(type='number' name="pages"  min=0)
            button.ui.positive.button 확인
</template>

<script>

</script>

<style>

</style>