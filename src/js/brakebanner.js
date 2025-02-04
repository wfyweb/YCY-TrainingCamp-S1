class BrakeBanner{
	constructor(selector){
		this.createApp(selector)
		this.loadImg()
	}
	// 创建容器
	createApp (selector){
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 'black'
		})
		document.querySelector(selector).appendChild(this.app.view)
	}
	// 引入图片资源
	loadImg (){
		const that = this
		const loader = new PIXI.Loader();
		this.loader = loader
		const loaderMap = {
			bike: 'images/brake_bike.png',
			handlerbar: 'images/brake_handlerbar.png',
			lever: 'images/brake_lever.png',
			btn: 'images/btn.png',
			btn_circle: 'images/btn_circle.png',
		}
		for(const key in loaderMap) {
			loader.add(key, loaderMap[key])
		}
		loader.load();
		loader.onComplete.add(() => {
			that.createBike()
			that.createButton()
			that.creatParticle()
		})
	}
	createBike(){
		const {app, loader} = this
		const bikeContainer = new PIXI.Container()
		  // 车轮
			let bike = new PIXI.Sprite(loader.resources['bike'].texture);
			// 车架
			let handler = new PIXI.Sprite(loader.resources['handlerbar'].texture);
			// 刹车
			let lever = new PIXI.Sprite(loader.resources['lever'].texture);
			// 设置车闸位置
			lever.x = 750
			lever.y = 950
			lever.pivot.x = 483
			lever.pivot.y = 500
			lever.rotation = Math.PI  * -15 / 180

			bikeContainer.addChild(bike);
			bikeContainer.addChild(lever);
			bikeContainer.addChild(handler);
			// 设置自行车容器位置
			bikeContainer.scale.x = .25
			bikeContainer.scale.y = .25
			bikeContainer.x = window.innerWidth - bikeContainer.width;
			bikeContainer.y = window.innerHeight - bikeContainer.height;
			app.stage.addChild(bikeContainer)
			this.lever = lever
			this.bikeContainer = bikeContainer
	}
	// 按钮容器
	createButton() {
		const {lever, bikeContainer, loader} = this
		const btnContainer = new PIXI.Container()
		
		this.app.stage.addChild(btnContainer)
		let btn = new PIXI.Sprite(loader.resources['btn'].texture);
		let btn_circle = new PIXI.Sprite(loader.resources['btn_circle'].texture);
		let btn_circle2 = new PIXI.Sprite(loader.resources['btn_circle'].texture);
		// 设置按钮圆心位置
		btn.pivot.x = btn.width / 2
		btn.pivot.y = btn.height / 2
		btn_circle.pivot.x = btn_circle.width / 2
		btn_circle.pivot.y = btn_circle.height / 2
		
		btn_circle2.pivot.x = btn_circle.width / 2
		btn_circle2.pivot.y = btn_circle.height / 2

		btn_circle.scale.x = btn_circle.scale.y = .8
		// 动画
		gsap.to(btn_circle.scale, {duration:1, x:1.3, y:1.3, repeat: -1})
		gsap.to(btn_circle, {duration:1, alpha:0, repeat: -1})
		// 缩小一半
		btnContainer.scale.x = .5
		btnContainer.scale.y = .5
		// 位置偏移 
		btnContainer.x = window.innerWidth - 300;
		btnContainer.y = window.innerHeight - 350;

		// 按钮按下事件
		btnContainer.interactive = true
		btnContainer.buttonMode = true
		btnContainer.on('mousedown',()=>{
			this.pause()
			btnContainer.on('mouseup',()=>{
				gsap.to(lever, {duration: .6, rotation:  Math.PI  * -15 / 180})
				gsap.to(bikeContainer,{duration:.4, x: window.innerWidth - bikeContainer.width, y: window.innerHeight - bikeContainer.height})
				btnContainer.addChild(btn_circle);
				this.start()
			})
		})
		btnContainer.addChild(btn);
		btnContainer.addChild(btn_circle);
		btnContainer.addChild(btn_circle2);
		this.btnContainer = btnContainer
		this.btn_circle = btn_circle
	}
	// 粒子容器 
	creatParticle() {
		const particleContaner = new PIXI.Container()
		this.app.stage.addChild(particleContaner)
		particleContaner.pivot.x = window.innerWidth/2;
		particleContaner.pivot.y = window.innerHeight/2;

		particleContaner.x = window.innerWidth/2;
		particleContaner.y = window.innerHeight/2;
		particleContaner.rotation = 35*Math.PI/180;
		let particles = []; // 保存粒子
		// 粒子颜色
		const colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x000000];
		for( let i=0; i<10; i++) {
			const particle = new PIXI.Graphics();
			const color = colors[Math.floor(Math.random() * colors.length)]
			particle.beginFill(color)
			// 随机位置画圆
			const x = Math.random() * window.innerWidth;
			const y = Math.random() * window.innerHeight;
			particle.drawCircle(0, 0, 6);
			particle.endFill();

			let pItem = {
				sx: x,
				sy: y,
				gr: particle
			}
			particle.x = x;
			particle.y = y;
			particleContaner.addChild(particle)
			particles.push(pItem);
		}
		let speed = 0;
		let move = ()=>{
			speed += .5
			speed = Math.min(speed,20)
			particles.forEach((item, i)=>{
				let pItem = particles[i];
				pItem.gr.y += speed;
				if(speed>=20){
					pItem.gr.scale.x = 0.03;
					pItem.gr.scale.y = 40;
				}
			// 当粒子移动超出范围时回到顶部
			if(pItem.gr.y>innerWidth)	pItem.gr.y=0;
			})
		}
		this.move = move
		this.speed = speed
		this.particles = particles
		this.start();
	}
	start(){
		this.speed = 0;
		gsap.ticker.add(this.move)
	}
	pause(){
		const {particles, lever, bikeContainer, btnContainer, btn_circle} = this
		//刹车动画
		gsap.to(lever, {duration: .6, rotation: Math.PI / 180 * -30})
		//自行车下移
		gsap.to(bikeContainer,{duration:.4, x: window.innerWidth - bikeContainer.width, y: window.innerHeight - bikeContainer.height +20});
		btnContainer.removeChild(btn_circle)
		// 移除粒子运动
		gsap.ticker.remove(this.move)
		// 粒子回弹动画
		for(let i = 0;i<particles.length;i++){
			let pItem = particles[i];
			pItem.gr.scale.y = 1;
			pItem.gr.scale.x = 1;
			gsap.to(pItem.gr,{duration:.6,x:pItem.sx,y:pItem.sy,ease:'elastic.out'});
		}
	}

}