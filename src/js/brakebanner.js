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
}