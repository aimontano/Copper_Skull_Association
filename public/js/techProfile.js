$(document).ready(function() {
  window.user = {};
  $.get("/api/user_data").then(function(userData) {
    sessionStorage.setItem('userName', userData.name); // stores session user
    sessionStorage.setItem('userEmail', userData.email); // stores session email
    sessionStorage.setItem('id', userData.id); //store user's ID
    user.name = userData.name;
    user.email = userData.email;
    user.id = userData.id;
    user.location = userData.location;
    $.get("/api/vehicle/" + userData.id).then(function(carData){
      // console.log(carData);
      if(carData.length > 0){
        user.carMake = carData[0].make;
        user.carModel = carData[0].model;
        user.carYear = carData[0].year;
      }
      $.get("/api/technician/orders/" + userData.id).then(function(orderData){
        if(orderData){
          for(let j=0; j<orderData.length; j++){
            orderData[j].date = orderData[j].date.split("T")[0];
          }
          console.log('order data', orderData);
          user.orders = orderData
        }
        // $.get("/api/technician").then(function(techData){
        //   if(techData.length > 0){
        //   user.technicians = [];
        //     for(let i=0; i<10 && i<techData.length; i++){
        //       tech = {};
        //         tech.techSkills = techData[i].skills;
        //         // tech.techRating = techData[i].rating;
        //         user.technicians.push(tech);
        //     }
        //   }
        //   console.log('tech user', user);
        //   renderTemplate(user);
        // });
        renderTemplate(user);
      });
    });
  });

  $(document).on('click', '.order-complete-button', function() {
    $.ajax('/api/orders', {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        id: $(this).data('order-id'),
        jobComplete: true
      })
    }).then(function() {
      location.reload();
    });
  });

  function renderTemplate(data) {
    // console.log(data);
    var source = $("#tech-page-template").text();
    var template = Handlebars.compile(source);
    var html = template(data);
    console.log('data', data);
    $("#app").html(html);
  }
});

