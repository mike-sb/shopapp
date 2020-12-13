$(document).ready(function() {

    $('.close').on('click', () => {

        $('.modal').modal('hide');
        $('.modal-body').empty();
    });
    $('#close').on('click', () => {

        $('.modal').modal('hide');
        $('.modal-body').empty();
    });


    $('#post_category').on('click', function(e) {
        $('.modal').modal('show')
        console.log('smth')
        e.preventDefault();
    });


    $('#save').on('click', function(e) {

        e.preventDefault();

        let category = $('#category').val();


        fetch("/add_category", {
            method: 'POST',
            credentials: 'same-origin',
            cors: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category })
        }).then(res => {
            console.log("Request complete! response:", res);
            if (res.status == 200) {
                $('.modal').modal('hide');
                $('.modal-body').empty();
            } else {
                $('.modal-body').append('<p class="text-danger"> Что-то пошло не так! Повторите попытку позже.</p>')
            }


        }).catch((error) => {
            console.error('Error:', error);
        });

    });







});