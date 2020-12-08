$(document).ready(function() {

            $('.close').on('click', () => {

                $('.modal').modal('hide');
                $('.modal-body').empty();
            });
            $('#close').on('click', () => {

                $('.modal').modal('hide');
                $('.modal-body').empty();
            });


            $('.register_first_form_button').on('click', function(e) {


                $('.modal').modal('show')

                e.preventDefault();
                email = $('#email').val();
                console.log("Clicked");


                fetch("/reg", {
                    method: 'POST',
                    credentials: 'same-origin',
                    cors: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                }).then(res => {
                    console.log("Request complete! response:", res);
                    if (res.status == 200) {
                        res.json().then(json => {


                            $('.modal-title').text(json.filename);
                            if (json.type == "txt") {

                                $('.modal-body').append('<p>' + json.data + '</p>')

                            }
                        });

                    } else {

                    }


                }).catch((error) => {
                    console.error('Error:', error);
                });


            });