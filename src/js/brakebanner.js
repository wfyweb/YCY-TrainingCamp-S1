class BrakeBanner{
	constructor(selector){
		this.createApp(selector)
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
}