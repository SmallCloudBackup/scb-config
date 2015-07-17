$(document).ready(function () {
  $.ajax({
		url: "/api/sources",
		method: "GET",
		dataType: "JSON"
	}).done(function (data) {
    if (data && data.ok) {
			var templ = Handlebars.compile($("#sources").html());
      $("#sourcesContainer").html(templ(data));
      for (var i = 0; i < data.objects.length; i++) {
        var svc = data.objects[i];
        $("button#editSource" + svc._id).click(function (e) {
          window.location.href = "/source-config/" + svc.type + "?id=" + svc._id;
        });
      }
    }
  });
});
