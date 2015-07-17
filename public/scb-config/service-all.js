$(document).ready(function () {
  $.ajax({
		url: "/api/services",
		method: "GET",
		dataType: "JSON"
	}).done(function (data) {
    if (data && data.ok) {
			var templ = Handlebars.compile($("#services").html());
      $("#serviceContainer").html(templ(data));
      for (var i = 0; i < data.objects.length; i++) {
        var svc = data.objects[i];
        $("button#editService" + svc._id).click(function (e) {
          window.location.href = "/service-config/" + svc.type + "?id=" + svc._id;
        });
      }
    }
  });
});
