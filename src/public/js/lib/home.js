$(function() {
    $("#this-is-me-button").click(function(e) {
        e.preventDefault();
        const name = $("#this-is-me-name").val();
        if (name) {
            $.ajax({
                type: "PUT",
                url: "/rest/isme/" + name,
                success: function() {
                    location.reload();
                }
            });
        }
    });
    $(".remove-me").click(function(e) {
        e.preventDefault();
        const name = $(this).attr('data-name')
        $.ajax({
            type: "DELETE",
            url: "/rest/isme/" + name,
            success: function() {
                location.reload();
            }
        });
    });
});