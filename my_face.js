$(document).ready(function(){

//###############
//  face canvas
//###############

var canvas = document.getElementById('my_face');

var canvas_width, 
    canvas_height,
    next_gen,
    changed,
    pixel_matrix,
    new_pixel_matrix,
    c,
    pixel_size,
    timer,
    is_active,
    white;

if (canvas && canvas.getContext){
  $(window).load(function(){
    canvas_width = $("#my_face_avatar").width(); 
    canvas_height= $("#my_face_avatar").height(); 

    canvas.width = canvas_width; 
    canvas.height = canvas_height; 
    next_gen = [];
    changed = [];
    pixel_matrix = [];

    new_pixel_matrix = [];  
    pixel_size = 5
    timer; 
    is_active = false; 
    white = 'rgba(0,0,0,0)'

    runCanvas(canvas); 
  

  })
}

function runCanvas(canvas){
  c = canvas.getContext('2d');
  var image = document.getElementById('my_face_avatar');
  c.drawImage(image, 0,0, canvas_width, canvas_height)
  pixelate_image(c);     
}//runCanvas()

canvas.addEventListener('mouseover',function(){
  if(!is_active){
    game_of_life(pixel_matrix);
  }
});

canvas.addEventListener('mouseout', function(){
  
  if (is_active=true){
    is_active=false  
  }
  window.clearTimeout(timer) 
  next_gen = [];
  changed = [];
  pixel_matrix = [];
  new_pixel_matrix = [];  
  runCanvas(canvas)
})

function pixelate_image(c){
  var imageData = c.getImageData(0, 0, canvas_width, canvas_height);
  var data = imageData.data
  var contrast_level = 10;
  
  for(y=0; y<canvas_height; y++){   
    var pixel_row = [];
    for(x=0; x<canvas_width; x++){
      var rand=Math.floor(Math.random()*255)
      var index = (y * canvas_width + x) * 4;
      var r = data[index];
      var g = data[index+1];
      var b = data[index+2];
      var fill_style = white
      /*
      var rand_color = 'rgb('+Math.floor(Math.random()*100).toString()+','+Math.floor(Math.random()*100).toString()+','+Math.floor(Math.random()*100).toString()+')';
      */
      var rand_color = 'rgb('+r+','+g+','+b+')';

      if (r+b+g < 550){
        fill_style = rand_color 
      } else {
        fill_style=white
      }
      /*
      var mid = 180
      var low = 0
      
      if(r>low && r<mid && g>low && g<mid && b>low && b<mid ){fill_style = rand_color};
      
      var mid = 180
      var low = 140
      */
      
      var is_active = true 
      if(fill_style==white){is_active = false;}
      
      pixel_row.push([[x],is_active]);
      
      c.fillStyle =fill_style 
      if (is_active){c.fillRect( x, y, pixel_size, pixel_size )} 
      else{c.clearRect( x, y, pixel_size, pixel_size )};
      x=x+(pixel_size-1)
    }
    pixel_matrix.push(pixel_row)
    y=y+(pixel_size-1)    
  }
}

function game_of_life(pixel_matrix){ 
  var old_matrix = pixel_matrix;
  var new_matrix = pixel_matrix; 
  var min = 2;
  var max = 3;
  is_active = true; 
  stepThrough()
  function stepThrough(){
    timer = window.setTimeout(function(){
        for(y=0; y<old_matrix.length; y++){
          for(x=0; x<old_matrix[0].length; x++){
            var old_state = old_matrix[y][x][1];
            
            /*     
            var rand_color = 'rgb('+Math.floor(Math.random()*100).toString()+','+Math.floor(Math.random()*100).toString()+','+Math.floor(Math.random()*100).toString()+')';
            */
            var rand_color = 'rgb('+Math.floor(Math.random()*255).toString()+','+Math.floor(Math.random()*255).toString()+','+Math.floor(Math.random()*255).toString()+')';
            
            var n = 0;
            if (old_matrix[y-1] && old_matrix[y-1][x-1] && old_matrix[y-1][x-1][1])	n++;
            if (old_matrix[y-1] && old_matrix[y-1][x  ] && old_matrix[y-1][x  ][1])	n++;
            if (old_matrix[y-1] && old_matrix[y-1][x+1] && old_matrix[y-1][x+1][1])	n++;
            if (old_matrix[y  ] && old_matrix[y  ][x-1] && old_matrix[y  ][x-1][1])	n++;
            if (old_matrix[y  ] && old_matrix[y  ][x+1] && old_matrix[y  ][x+1][1])	n++;
            if (old_matrix[y+1] && old_matrix[y+1][x-1] && old_matrix[y+1][x-1][1])	n++;
            if (old_matrix[y+1] && old_matrix[y+1][x  ] && old_matrix[y+1][x  ][1])	n++;
            if (old_matrix[y+1] && old_matrix[y+1][x+1] && old_matrix[y+1][x+1][1])	n++;
            
            var live_neighbors = n; 
  
            new_matrix[y][x][1]=false;  
            
            if(old_state==true){
              if (live_neighbors === min || live_neighbors === max){
                new_matrix[y][x][1]=true;  
              }
            } else if(live_neighbors === max){
                new_matrix[y][x][1]=true;                 
            } 

            if(new_matrix[y][x][1] == true){
              c.fillStyle = rand_color
              c.fillRect(x*pixel_size, y*pixel_size, pixel_size, pixel_size)                    
            } else {
              c.clearRect(x*pixel_size, y*pixel_size, pixel_size, pixel_size) 
            }
          }
        }
        old_matrix = new_matrix      
        stepThrough(); 

    }, 60); //setTimeout
  }
}

});

