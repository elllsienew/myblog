import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const _motion = motion;

  const groupedArtworks = {
    Watercolor: [
     
      {
        src: "./images/water/20240530_0001.jpg",
        title: "我的第一幅水彩",
        description: "",
      },
      {
        src: "./images/water/20240530_0002.jpg",
        title: "我的第二幅水彩",
        description: "",
      },
      {
        src: "./images/water/20240611_0005.jpg",
        title: "我的第三幅水彩",
        description: "",
      },

      {
        src: "./images/water/20240611_0012.jpg",
        title: "summer",
        description: "at the beginning",
      },
      {
        src: "./images/water/20240611_0010.jpg",
        title: "小花",
        description: "at the beginning",
      },
      {
        src: "./images/water/20240611_0008.jpg",
        title: "小花2",
        description: "at the beginning",
      },
      {
        src: "./images/water/20240704_0001.jpg",
        title: "我的阿勒泰",
        description: "",
      },
      {
        src: "./images/water/20240708_0001.jpg",
        title: "最开始",
        description: "",
      },

      {
        src: "./images/water/20240602_0001.jpg",
        title: "夕阳树影",
        description: "",
      },

      {
        src: "./images/water/20240706_0003.jpg",
        title: "昆明西山",
        description: "",
      },
      {
        src: "./images/water/20240611_0015.jpg",
        title: "昆明大观楼",
        description: "",
      },
      {
        src: "./images/water/20240730_0001.jpg",
        title: "画猫猫",
        description: "",
      },
      {
        src: "./images/water/20240801_0001.jpg",
        title: "时间在飞",
        description: "瞬间组成永恒",
      },
      {
        src: "./images/water/20240611_0029.jpg",
        title: "暮色将尽",
        description: "",
      },

      {
        src: "./images/water/20240530_0009.jpg",
        title: "原野",
        description: "",
      },
      {
        src: "./images/water/20251030_0049.jpg",
        title: "绿",
        description: "",
      },
      {
        src: "./images/water/20251030_0057.jpg",
        title: "西华公园的一角",
        description: "",
      },
      {
        src: "./images/water/20251030_0059.jpg",
        title: "夕阳",
        description: "",
      },
  
      {
        src: "./images/water/20240709_0001.jpg",
        title: "",
        description: "",
      },

      {
        src: "./images/water/20240611_0022.jpg",
        title: "家乡",
        description: "",
      },
      {
        src: "./images/water/20240714_0001.jpg",
        title: "路",
        description: "where to go",
      },
      {
        src: "./images/water/20241210_0003.jpg",
        title: "背",
        description: "",
      },
      {
        src: "./images/water/20240722_0003.jpg",
        title: "Eminem",
        description: "a Stan from my teenager",
      },




      {
        src: "./images/water/20240717_0002.jpg",
        title: "临摹蒙克",
        description: "",
      },
      {
        src: "./images/water/20241210_0001.jpg",
        title: "小屋",
        description: "温柔的夕阳",
      },
      {
        src: "./images/water/20240707_0002.jpg",
        title: "夕阳",
        description: "总是美的",
      },
      {
        src: "./images/water/20241008_0002.jpg",
        title: "猫",
        description: "我哭的时候 它就这么看我一眼 立刻跑了...",
      },
      {
        src: "./images/water/20251030_0048.jpg",
        title: "卢浦大桥",
        description: "夕阳余晖",
      },
 

      {
        src: "./images/water/20251030_0051.jpg",
        title: "夕阳",
        description: "where to go",
      },
      {
        src: "./images/water/20251030_0052.jpg",
        title: "上海",
        description: "永嘉路写生",
      },
      {
        src: "./images/water/20251030_0053.jpg",
        title: "昆明",
        description: "第一次参加速写活动",
      },
      {
        src: "./images/water/20251030_0001.jpg",
        title: "昆明",
        description: "参加速写活动",
      },
      {
        src: "./images/water/20250607_0011.jpg",
        title: "蓝",
        description: "when i feel sad ",
      },
      {
        src: "./images/water/20250607_0012.jpg",
        title: "江边的风",
        description: "",
      },
      {
        src: "./images/water/20251105_0008.jpg",
        title: "雪人",
        description: "昆明街边的小雪人",
      },
      
      {
        src: "./images/water/20251105_0002.jpg",
        title: "背影",
        description: "Wolfgang Tillmans 沃尔夫冈·提尔曼斯的摄影作品",
      },
      {
        src: "./images/water/20251030_0002.jpg",
        title: "水边",
        description: "forever now 宁静的片刻就是永恒",
      },
      {
        src: "./images/water/20251030_0004.jpg",
        title: "旧楼",
        description: "电动车画到一半开走了2333",
      },
      {
        src: "./images/water/20251030_0003.jpg",
        title: "猫",
        description: "那天 是温柔",
      },
      
    ],
    Sketch: [
      {
        src: "./images/sketch/20251029_0001.jpg",
        title: "小花",
        description: "一家撸猫馆饮品店合二为一的店",
      },
      {
        src: "./images/sketch/20251029_0002.jpg",
        title: "公园",
        description: "是观察人的好地方",
      },
      {
        src: "./images/sketch/20251029_0005.jpg",
        title: "公园",
        description: "家附近的公园，当开始画画，我就失去了欣赏景色的时间",
      },
      {
        src: "./images/sketch/20251029_0006.jpg",
        title: "外卖骑手",
        description: "在路边吃东西的时候拍到的，等餐过程中就画了下来",
      },
      {
        src: "./images/sketch/20251029_0003.jpg",
        title: "咖啡馆的女孩",
        description: "家附近最常去的一个咖啡馆，在那儿寻找到一些宁静",
      },
      {
        src: "./images/sketch/20251029_0008.jpg",
        title: "路边的车",
        description: "那天路灯下的雨像飘雪",
      },
      {
        src: "./images/sketch/20251029_0009.jpg",
        title: "图书角",
        description: "有书的地方让人安静下来",
      },
      {
        src: "./images/sketch/20251029_0010.jpg",
        title: "植物",
        description: "爱人如养花",
      },
      {
        src: "./images/sketch/20251029_0012.jpg",
        title: "老头",
        description: "",
      },
      {
        src: "./images/sketch/20251029_0013.jpg",
        title: "一个咖啡馆",
        description: "虹山有集",
      },
      {
        src: "./images/sketch/20251029_0017.jpg",
        title: "饮品",
        description: "南亚的咖啡馆，晚上化身酒吧的那种",
      },
      {
        src: "./images/sketch/20251029_0018.jpg",
        title: "纸巾盒",
        description: "南亚的咖啡馆，晚上化身酒吧的那种",
      },
      {
        src: "./images/sketch/20251029_0019.jpg",
        title: "沙发",
        description: "南亚的咖啡馆，晚上化身酒吧的那种",
      },
      {
        src: "./images/sketch/20251029_0016.jpg",
        title: "花花草草",
        description: "翠湖边忘了名字的咖啡馆",
      },
      {
        src: "./images/sketch/20251029_0015.jpg",
        title: "xiao deng",
        description: "巧克力",
      },
      {
        src: "./images/sketch/20251030_0039.jpg",
        title: "脸",
        description: "",
      },
      {
        src: "./images/sketch/20251030_0034.jpg",
        title: "脸",
        description: "",
      },
      {
        src: "./images/sketch/20250607_0007.jpg",
        title: "Luigi",
        description: "",
      },
      {
        src: "./images/sketch/000.JPG",
        title: "小时候的画",
        description: "",
      },

    ],
    Digital: [
      {
        src: "./images/digital/IMG_4409.JPG",
        title: "梦",
        description: "光跑了",
      },
      {
        src: "./images/digital/IMG_4410.JPG",
        title: "娃娃",
        description: "它永远在笑",
      },
      {
        src: "./images/digital/IMG_4411.JPG",
        title: "花",
        description: "不会枯萎的花还美么",
      },
      {
        src: "./images/digital/IMG_4412.JPG",
        title: "建筑物",
        description: "规则的记忆",
      },
      {
        src: "./images/digital/IMG_4413.JPG",
        title: "背影",
        description: "记忆总是越来越远",
      },

      {
        src: "./images/digital/IMG_4415.JPG",
        title: "小屋",
        description: "该是温暖的吧",
      },
      {
        src: "./images/digital/IMG_4416.JPG",
        title: "友谊",
        description: "撒欢儿的两只咩",
      },
      {
        src: "./images/digital/IMG_4417.JPG",
        title: "自画像",
        description: "撒欢儿两只咩",
      },
      {
        src: "./images/digital/IMG_4622.JPG",
        title: "Emienm",
        description: "",
      },
    ],
  };

  const openModal = (group, index) => {
    setSelectedGroup(group);
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedGroup(null);
    setSelectedIndex(0);
  };

  const showNext = () => {
    const artworks = groupedArtworks[selectedGroup];
    setSelectedIndex((prev) => (prev + 1) % artworks.length);
  };

  const showPrev = () => {
    const artworks = groupedArtworks[selectedGroup];
    setSelectedIndex(
      (prev) => (prev - 1 + artworks.length) % artworks.length
    );
  };

  const selectedArtwork =
    selectedGroup !== null
      ? groupedArtworks[selectedGroup][selectedIndex]
      : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-yellow-50 p-10 overflow-hidden">
      {/* 分组展示 */}
      {Object.entries(groupedArtworks).map(([group, artworks], index) => (
        <motion.div
          key={group}
          className="mb-24 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 * index, duration: 1.2 }}
        >
          {/* 章节标题 */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <h3 className="mx-6 text-3xl font-light text-gray-800 italic tracking-wide">
              {group}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* 图片区域 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {artworks.map((art, i) => (
              <motion.div
                key={i}
                className={`relative group w-full aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-transform duration-500 bg-gray-200`}
                onClick={() => openModal(group, i)}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={art.src}
                  alt={art.title}
                  className="w-full h-full object-cover scale-[1.2] transform group-hover:scale-110 transition-transform duration-700"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <p className="absolute bottom-3 left-0 w-full text-center text-white text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {art.title}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* 全屏艺术介绍层 */}
      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 背景虚化 */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30"
              style={{ backgroundImage: `url(${selectedArtwork.src})` }}
            />

            {/* 内容区域 */}
            <motion.div
              className="relative z-10 text-center max-w-3xl px-6 text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.img
                src={selectedArtwork.src}
                alt={selectedArtwork.title}
                className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl mx-auto mb-10"
              />

              <h3 className="text-4xl font-light mb-4">
                {selectedArtwork.title}
              </h3>
              <p className="text-lg italic leading-relaxed text-gray-200">
                {selectedArtwork.description}
              </p>

              {/* 上一张 / 下一张 */}
              <div className="flex justify-center gap-10 mt-8 text-2xl">
                <button
                  onClick={showPrev}
                  className="text-gray-300 hover:text-white transition"
                >
                  ‹ Prev
                </button>
                <button
                  onClick={showNext}
                  className="text-gray-300 hover:text-white transition"
                >
                  Next ›
                </button>
              </div>
              
              {/* 右上角关闭按钮 */}
              <motion.button
                onClick={closeModal}
                className="absolute top-6 right-6 text-4xl text-white/70 hover:text-white transition z-50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                ✕
              </motion.button>
{/* 
              <motion.button
                onClick={closeModal}
                className="mt-10 text-2xl text-gray-300 hover:text-white transition"
              >
                ✕ Close
              </motion.button> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
