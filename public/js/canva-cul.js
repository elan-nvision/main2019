
var w = window.innerWidth,
  h = window.innerHeight,
  canvas = document.getElementById('test'),
  ctx = canvas.getContext('2d', { alpha: false }),
  arc = 100,
  numImages = 17,
  imgDir = '/img/canva-culti/',
  size = 7,
  speed = (10 + 0.01*window.innerWidth)/20,
  parts = new Array,
  colors = ['#16A085', '#2ECC71', '#27AE60', '#3498DB','#2980B9','#9B59B6','#8E44AD','#34495E',
    '#F1C40F','#F39C12','#E67E22','#D35400','#E74C3C','#C0392B','#ECF0F1','#BDC3C7','#95A5A6','#7F8C8D'],
  backImages = Array(numImages).fill().map((_, i) => { 
    var img = new Image(); 
    img.onload = () => { backImages[i].loaded = true; }
    return { 
      img: img,
      loaded: false
    }; 
  });
backImages.forEach((s, i) => s.img.src = imgDir + (i+1) + '.png');

var mouse = { x: 0, y: 0 };

canvas.setAttribute('width',w);
canvas.setAttribute('height',h);

function create() {

  for(var i = 0; i < arc; i++) {
    parts[i] = {
      x: Math.ceil(Math.random() * w),
      y: Math.ceil(Math.random() * h),
      dX: (Math.random() * 5 - 1)*speed,
      dY: (Math.random() * 2 - 1)*speed,
      c: colors[Math.floor(Math.random()*colors.length)],
      size: Math.random() * size,
    }
  }
}

function particles() {
  ctx.clearRect(0,0,w,h);
  parts.forEach((li, i) => {
    if(i < numImages){
      if(backImages[i].loaded) ctx.drawImage(backImages[i].img, li.x, li.y);
    }
    else {
      ctx.beginPath();
      ctx.fillStyle = li.c;
      ctx.arc(li.x,li.y,li.size,0,Math.PI*2,false);
      ctx.fill();
      ctx.closePath();
    }

    li.x += li.dX;
    li.y += li.dY;

    if(li.x > w) li.x = 0; 
    if(li.y > h) li.y = 0; 
    if(li.x < 0) li.x = w; 
    if(li.y < 0) li.y = h; 
  });
  
  requestAnimationFrame(particles);
}

create();
particles();
