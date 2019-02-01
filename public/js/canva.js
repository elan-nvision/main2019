var w = window.innerWidth,
    h = window.innerHeight,
    canvas = document.getElementById('test'),
    arc = 100,
    size = 7,
    speed = (10 + 0.01*window.innerWidth)/20,
    parts = new Array,
    colors = ['#16A085', '#2ECC71', '#27AE60', '#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E',
      '#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D'];

canvas.width = w;
canvas.height = h;

ctx = canvas.getContext('2d');

function create() {
  for(var i = 0; i < arc; i++) {
    parts[i] = {
      x: Math.ceil(Math.random() * w),
      y: Math.ceil(Math.random() * h),
      toX: Math.random() * 5 - 1,
      toY: Math.random() * 2 - 1,
      c: colors[Math.floor(Math.random()*colors.length)],
      size: Math.random() * size
    }
  }
}

function particles() {
  ctx.clearRect(0,0,w,h);

  for(var li of parts) {

    ctx.beginPath();
    ctx.fillStyle = li.c;
    ctx.arc(li.x,li.y,li.size,0,Math.PI*2,false);
    ctx.fill();
    ctx.closePath();

    li.x += li.toX * speed;
    li.y += li.toY * speed;

    if(li.x > w) li.x = 0; 
    else if(li.x < 0) li.x = w; 

    if(li.y > h) li.y = 0;     
    else if(li.y < 0) li.y = h;
  }

  requestAnimationFrame(particles);
}

create();
particles();
