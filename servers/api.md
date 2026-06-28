基础接口
接口名称	请求路径	描述
获取接口调用凭据	/cgi-bin/token	本接口用于获取获取全局唯一后台接口调用凭据（Access Token），token 有效期为 7200 秒，开发者需要进行妥善保存，使用注意事项请参考此文档
获取稳定版接口调用凭据	/cgi-bin/stable_token	本接口用于获取获取全局唯一后台接口调用凭据（Access Token），token 有效期为 7200 秒，但此接口和 getAccessToken 互相隔离，
网络通信检测	/cgi-bin/callback/check	为了帮助开发者排查回调连接失败的问题，提供这个网络检测的API
获取微信API服务器IP	/cgi-bin/get_api_domain_ip	该接口用于获取微信 api 服务器 ip 地址（开发者服务器主动访问 api.weixin.qq.com 的远端地址）
获取微信推送服务器IP	/cgi-bin/getcallbackip	该接口用于获取微信推送服务器 ip 地址（向开发者服务器推送信息的微信服务器来源地址）
openApi管理
接口名称	请求路径	描述
重置API调用次数	/cgi-bin/clear_quota	本接口是通过access_token清空服务端接口的每日调用接口次数
查询API调用额度	/cgi-bin/openapi/quota/get	本接口用于查询服务端接口的的每日调用接口的额度，调用次数，频率限制
查询rid信息	/cgi-bin/openapi/rid/get	本接口用于查询调用服务端接口报错返回的rid详情信息，辅助开发者高效定位问题
使用AppSecret重置API调用次数	/cgi-bin/clear_quota/v2	本接口是通过AppSecret清空服务端接口的每日调用接口次数
重置指定API调用次数	/cgi-bin/openapi/quota/clear	本接口使用 access_token 来重置指定接口的每日调用次数
自定义菜单
接口名称	请求路径	描述
创建自定义菜单	/cgi-bin/menu/create	该接口用于创建公众号/服务号的自定义菜单
查询自定义菜单信息	/cgi-bin/get_current_selfmenu_info	本接口提供公众号当前使用的自定义菜单的配置，如果公众号是通过API调用设置的菜单，则返回菜单的开发配置，而如果公众号是在公众平台官网通过网站功能发布菜单，则本接
获取自定义菜单配置	/cgi-bin/menu/get	使用接口创建自定义菜单后，开发者还可使用接口查询自定义菜单的结构
删除自定义菜单	/cgi-bin/menu/delete	删除当前使用的自定义菜单
创建个性化菜单	/cgi-bin/menu/addconditional	为了帮助公众号实现灵活的业务运营，微信公众平台新增了个性化菜单接口，开发者可以通过该接口，让公众号的不同用户群体看到不一样的自定义菜单
删除个性化菜单	/cgi-bin/menu/delconditional	删除指定个性化菜单
测试个性化菜单匹配结果	/cgi-bin/menu/trymatch	测试用户看到的菜单配置
基础消息
群发消息
接口名称	请求路径	描述
上传发表内容中的图片	/cgi-bin/media/uploadimg	本接口用于上传发表内容（文章或贴图）所需的图片
删除群发消息	/cgi-bin/message/mass/delete	群发之后，随时可以通过该接口删除群发
获取群发速度	/cgi-bin/message/mass/speed/get	本接口用于获取消息的群发速度
查询群发消息发送状态	/cgi-bin/message/mass/get	本接口用于查询群发消息发送状态
预览消息	/cgi-bin/message/mass/preview	本接口发送消息给指定用户，在手机端查看消息的样式和排版
根据标签群发消息	/cgi-bin/message/mass/sendall	本接口用于根据标签群发消息
设置群发速度	/cgi-bin/message/mass/speed/set	本接口用于设置消息的群发速度
上传图文消息素材	/cgi-bin/media/uploadnews	本接口用于上传图文消息，该能力已更新为草稿箱
一次性订阅消息
接口名称	请求路径	描述
发送一次性订阅消息	/cgi-bin/message/template/subscribe	推送订阅模板消息给授权微信用户
自动回复
接口名称	请求路径	描述
获取自动回复规则	/cgi-bin/get_current_autoreply_info	获取公众号当前使用的自动回复规则，包括关注后自动回复、消息自动回复、关键词自动回复
素材管理
永久素材
接口名称	请求路径	描述
获取永久素材	/cgi-bin/material/get_material	本接口用于根据media_id获取永久素材的详细信息
获取永久素材总数	/cgi-bin/material/get_materialcount	本接口用于获取公众号永久素材的总数信息
获取永久素材列表	/cgi-bin/material/batchget_material	分类型获取永久素材列表，包含公众号在官网素材管理模块新建的素材
上传发表内容中的图片	/cgi-bin/media/uploadimg	本接口用于上传发表内容（文章或贴图）所需的图片
上传永久素材	/cgi-bin/material/add_material	本接口用于新增图片/语音/视频等类型的永久素材
删除永久素材	/cgi-bin/material/del_material	本接口用于删除不再需要的永久素材，节省存储空间
临时素材
接口名称	请求路径	描述
获取临时素材	/cgi-bin/media/get	本接口用于获取临时素材（即下载临时的多媒体文件）
新增临时素材	/cgi-bin/media/upload	本接口用于上传临时多媒体文件
获取高清语音素材	/cgi-bin/media/get/jssdk	本接口用于获取从 JSSDK 的 uploadVoice 接口上传的临时语音素材，格式为speex，16K采样率
草稿管理与商品卡片
草稿管理
接口名称	请求路径	描述
草稿箱开关设置	/cgi-bin/draft/switch	本接口用于设置或查询草稿箱和发布功能的开关状态
更新草稿	/cgi-bin/draft/update	本接口用于修改图文或图片消息草稿
获取草稿列表	/cgi-bin/draft/batchget	新增草稿之后，可用本接口获取草稿列表信息
新增草稿	/cgi-bin/draft/add	本接口用于新增常用的素材到草稿箱
获取草稿的总数	/cgi-bin/draft/count	获取草稿的总数，此接口只统计数量，不返回草稿的具体内容
删除草稿	/cgi-bin/draft/delete	删除指定草稿，节省空间
获取草稿详情	/cgi-bin/draft/get	新增草稿后，可通过该接口下载草稿
商品卡片
接口名称	请求路径	描述
获取商品卡片的DOM结构	/channels/ec/service/product/getcardinfo	本接口用于获取在文章中插入商品卡片所需的DOM结构
留言管理
接口名称	请求路径	描述
打开已群发文章评论	/cgi-bin/comment/open	本接口用于打开已群发图文的评论功能，公众号需具备留言功能权限
查看指定文章的评论数据	/cgi-bin/comment/list	本接口用于查看指定文章的评论数据
关闭已群发文章评论	/cgi-bin/comment/close	本接口用于关闭已群发文章评论
评论标记精选	/cgi-bin/comment/markelect	本接口用于将评论标记精选
评论取消精选	/cgi-bin/comment/unmarkelect	本接口将评论取消精选
删除评论	/cgi-bin/comment/delete	本接口用于删除评论
回复评论	/cgi-bin/comment/reply/add	本接口用于回复评论
删除回复	/cgi-bin/comment/reply/delete	本接口用于删除评论的回复内容
发布能力
接口名称	请求路径	描述
获取已发布的消息列表	/cgi-bin/freepublish/batchget	本接口用于获取已成功发布的消息列表
删除发布文章	/cgi-bin/freepublish/delete	本接口用于删除已发布的文章，此操作不可逆，请谨慎操作
发布状态查询	/cgi-bin/freepublish/get	本接口用于查询发布任务的状态和详情
获取已发布图文信息	/cgi-bin/freepublish/getarticle	本接口用于获取已发布的图文信息
发布草稿	/cgi-bin/freepublish/submit	本接口用于将图文草稿提交发布
用户管理
标签管理
接口名称	请求路径	描述
获取标签下粉丝列表	/cgi-bin/user/tag/get	本接口用于获取标签下粉丝列表
获取标签	/cgi-bin/tags/get	本接口用于获取公众号已创建的标签列表
创建标签	/cgi-bin/tags/create	本接口用于创建公众号标签
编辑标签	/cgi-bin/tags/update	本接口用于修改已存在的标签信息
删除标签	/cgi-bin/tags/delete	本接口用于删除已存在的标签信息
批量为用户取消标签	/cgi-bin/tags/members/batchuntagging	本接口用于批量为多个用户取消标签
批量为用户打标签	/cgi-bin/tags/members/batchtagging	本接口用于批量为多个用户打标签
获取用户的标签列表	/cgi-bin/tags/getidlist	本接口用于获取粉丝用户的标签列表
用户信息
接口名称	请求路径	描述
取消拉黑用户	/cgi-bin/tags/members/batchunblacklist	本接口用来取消拉黑一批用户，黑名单列表由一串OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的）组成
获取公众号的黑名单列表	/cgi-bin/tags/members/getblacklist	本接口用来获取账号的黑名单列表，黑名单列表由一串 OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的）组成
获取用户基本信息	/cgi-bin/user/info	在关注者与公众号产生消息交互后，公众号可获得关注者的OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的
批量获取用户基本信息	/cgi-bin/user/info/batchget	本接口用于批量获取用户基本信息
获取关注用户列表	/cgi-bin/user/get	本接口用来获取账号的关注者列表，关注者列表由一串OpenID（加密后的微信号，每个用户对每个公众号的OpenID是唯一的）组成
拉黑用户	/cgi-bin/tags/members/batchblacklist	本接口用于拉黑一批用户，黑名单列表由一串 OpenID （加密后的微信号，每个用户对每个公众号的OpenID是唯一的）组成
设置用户备注名	/cgi-bin/user/info/updateremark	本接口用于对指定用户设置备注名，该接口暂时开放给微信认证的服务号
转换openid
接口名称	请求路径	描述
转换openid	/cgi-bin/changeopenid	该接口用于公众号、服务号之后进行 openid 转换
客服消息
客服管理
接口名称	请求路径	描述
设置客服头像	/customservice/kfaccount/uploadheadimg	本接口用于设置客服头像
删除客服账号	/customservice/kfaccount/del	本接口用于删除客服账号
邀请绑定客服账号	/customservice/kfaccount/inviteworker	本接口用于邀请微信号绑定客服账号
获取所有客服账号	/cgi-bin/customservice/getkflist	本接口用于获取所有客服账号
添加客服账号	/customservice/kfaccount/add	本接口用于为公众号、小程序添加客服账号，每个账号最多添加100个客服账号
获取在线客服列表	/cgi-bin/customservice/getonlinekflist	本接口用于获取当前在线客服列表
修改客服账号	/customservice/kfaccount/update	本接口用于修改公众号客服账号信息
会话控制
接口名称	请求路径	描述
获取客服会话列表	/customservice/kfsession/getsessionlist	本接口用于获取指定客服的当前会话列表
关闭会话	/customservice/kfsession/close	本接口用于关闭已建立的客服会话
创建会话	/customservice/kfsession/create	本接口用于在客服和用户之间创建一个会话
获取客户会话状态	/customservice/kfsession/getsession	本接口用于获取指定客户的当前会话状态
获取未接入会话列表	/customservice/kfsession/getwaitcase	本接口用于获取未接入的客户会话列表
客服消息
接口名称	请求路径	描述
获取聊天记录	/customservice/msgrecord/getmsglist	本接口用于获取客服聊天记录
客服输入状态	/cgi-bin/message/custom/typing	本接口用于设置客服输入状态
发送客服消息	/cgi-bin/message/custom/send	本接口用于发送多种类型的客服消息，主要应用在有人工消息处理环节的场景
数据统计
用户数据
接口名称	请求路径	描述
获取用户增减数据	/datacube/getusersummary	本接口用于获取用户增减数据分析数据
获取累计用户数据	/datacube/getusercumulate	本接口用于获取用户累计数据分析数据
图文数据
接口名称	请求路径	描述
获取图文群发每日数据	/datacube/getarticlesummary	本接口用于获取某天所有被阅读过的群发文章当天的阅读数据
获取图文阅读分时数据	/datacube/getuserreadhour	本接口用于获取图文阅读分时数据
获取图文转发分时数据	/datacube/getusersharehour	本接口用于获取图文转发分时数据
获取图文阅读概况数据	/datacube/getuserread	本接口用于获取图文阅读概括数据
获取图文群发总数据	/datacube/getarticletotal	获取群发文章从群发日起的总量统计数据
获取图文转发概况数据	/datacube/getusershare	本接口用于获取图文转发概况数据
获取发表内容每日阅读数据	/datacube/getarticleread	本接口用于获取某天所有被阅读过的发表内容的阅读指标
获取发表内容每日分享数据	/datacube/getarticleshare	本接口用于获取某天所有被分享过的发表内容的分享指标
获取发表内容概况总数据	/datacube/getbizsummary	本接口用于获取圈选日期内，该账号下发表内容汇总的概览数据
获取发表内容发表详细数据	/datacube/getarticletotaldetail	本接口用于获取 圈选日期内 所有发表内容的详细数据
消息数据
接口名称	请求路径	描述
获取消息发送概况数据	/datacube/getupstreammsg	本接口用于获取消息发送概况数据
获取消息发送月数据	/datacube/getupstreammsgmonth	本接口用于获取消息发送月数据
获取消息发送分布周数据	/datacube/getupstreammsgdistweek	本接口用于获取消息发送分布周数据
获取消息发送分布月数据	/datacube/getupstreammsgdistmonth	本接口用于获取消息发送分布月数据
获取消息发送分时数据	/datacube/getupstreammsghour	本接口用于获取消息发送分时统计数据
获取消息发送周数据	/datacube/getupstreammsgweek	本接口用于获取消息发送周数据
获取消息发送分布数据	/datacube/getupstreammsgdist	本接口用于获取消息发送分布数据
接口数据
接口名称	请求路径	描述
获取被动回复概要数据	/datacube/getinterfacesummary	本接口用于获取被动回复概要数据
获取被动回复分布数据	/datacube/getinterfacesummaryhour	本接口用于获取被动回复分布数据
网页开发
JS-SDK
接口名称	请求路径	描述
获取sdk临时票据	/cgi-bin/ticket/getticket	Apiticket 是用于调用 js-sdk 的临时票据，有效期为7200 秒，通过accesstoken 来获取
智能接口
开放接口
接口名称	请求路径	描述
微信翻译	/cgi-bin/media/voice/translatecontent	本接口用于文本内容翻译
上传语音文件	/cgi-bin/media/voice/addvoicetorecofortext	本接口用于上传语音文件进行转文字识别
获取语音识别结果	/cgi-bin/media/voice/queryrecoresultfortext	本接口用于查询语音转文字结果
ORC识别
接口名称	请求路径	描述
菜单识别	/cv/ocr/menu	本接口用于识别纸质菜单
通用印刷体识别	/cv/ocr/comm	本接口用于识别通用印刷体
行驶证识别	/cv/ocr/driving	提供机动车行驶证信息OCR识别
银行卡识别	/cv/ocr/bankcard	本接口提供银行卡卡面信息OCR识别
营业执照识别	/cv/ocr/bizlicense	本接口提供营业执照 OCR 识别能力
驾驶证识别	/cv/ocr/drivinglicense	本接口用于驾驶证识别
身份证识别	/cv/ocr/idcard	本接口提供身份证正反面OCR识别功能
图像处理
接口名称	请求路径	描述
图片智能裁剪	/cv/img/aicrop	本接口用于对图片主体区域进行智能识别和裁剪
二维码/条码识别	/cv/img/qrcode	识别图片中的二维码、条码、DataMatrix和PDF417
微信门店
门店小程序
接口名称	请求路径	描述
拉取门店小程序类目	/wxa/get_merchant_category	本接口用于获取门店小程序的一级和二级类目信息
创建门店小程序	/wxa/apply_merchant	本接口用于创建门店小程序主体信息
获取门店小程序审核结果	/wxa/get_merchant_audit_info	本接口用于获取门店小程序审核结果
修改门店小程序信息	/wxa/modify_merchant	本接口用于修改门店小程序信息
获取省市区信息	/wxa/get_district	本接口用于获取省市区信息
搜索门店地图信息	/wxa/search_map_poi	本接口用于搜索门店地图信息
新增门店	/wxa/add_store	本接口用于新增门店
获取门店详情	/wxa/get_store_info	本接口用于获取门店详情
获取门店列表	/wxa/get_store_list	本接口用于获取门店列表
删除门店	/wxa/del_store	本接口用于删除门店
更新门店信息	/wxa/update_store	本接口用于更新门店信息
在地图中创建门店	/wxa/create_map_poi	本接口用于在腾讯地图中创建门店
微信就医助手
接口名称	请求路径	描述
消息推送接口	/cityservice/sendchannelmsg	用于下发就医助手消息，结合通用参数和不同子状态status参数组合实现各类业务消息推送，要获取所有status参数，请查看微信就医助手开发文档