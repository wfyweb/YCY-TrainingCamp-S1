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
		// const that = this
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
	}
}