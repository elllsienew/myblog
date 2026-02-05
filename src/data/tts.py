#!/usr/bin/env python3
"""
TTS音频批量生成脚本 - 支持文件夹处理
支持单个JSON文件、多个JSON文件、或整个文件夹下的JSON文件
用法: python tts_batch.py [文件/文件夹]
"""

import json
import os
import re
import sys
import azure.cognitiveservices.speech as speechsdk

# ====== Azure 配置 ======
SPEECH_KEY = "你的 Azure Key"
SERVICE_REGION = "japaneast"
VOICE = "de-DE-KatjaNeural"

# =========================
# 初始化语音配置
# =========================
speech_config = speechsdk.SpeechConfig(
    subscription=SPEECH_KEY,
    region=SERVICE_REGION
)
speech_config.speech_synthesis_voice_name = VOICE
speech_config.set_speech_synthesis_output_format(
    speechsdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3
)

# =========================
# 工具函数
# =========================
def safe_filename(name: str) -> str:
    """生成安全的文件名"""
    name = name.strip().lower()
    name = re.sub(r"[^\wäöüß-]", "_", name)
    return name

def find_all_json_files(input_paths):
    """查找所有JSON文件，支持文件、文件夹和通配符"""
    json_files = []
    
    for path in input_paths:
        # 如果是通配符
        if "*" in path or "?" in path:
            import glob
            matched_files = glob.glob(path, recursive=True)
            for file in matched_files:
                if os.path.isfile(file) and file.endswith('.json'):
                    json_files.append(os.path.abspath(file))
        
        # 如果是文件夹
        elif os.path.isdir(path):
            # 遍历文件夹及其子文件夹
            for root, dirs, files in os.walk(path):
                for file in files:
                    if file.endswith('.json'):
                        full_path = os.path.join(root, file)
                        json_files.append(os.path.abspath(full_path))
        
        # 如果是文件（直接路径）
        elif os.path.isfile(path) and path.endswith('.json'):
            json_files.append(os.path.abspath(path))
        
        # 如果是文件（不带.json扩展名）
        elif os.path.isfile(path + '.json'):
            json_files.append(os.path.abspath(path + '.json'))
        
        # 尝试在json/目录下查找
        elif os.path.isdir("json"):
            # 检查在json/目录下的文件
            json_path = os.path.join("json", path)
            if os.path.isfile(json_path) and json_path.endswith('.json'):
                json_files.append(os.path.abspath(json_path))
            elif os.path.isfile(json_path + '.json'):
                json_files.append(os.path.abspath(json_path + '.json'))
            elif os.path.isdir(json_path):
                # 遍历json/下的子文件夹
                for root, dirs, files in os.walk(json_path):
                    for file in files:
                        if file.endswith('.json'):
                            full_path = os.path.join(root, file)
                            json_files.append(os.path.abspath(full_path))
    
    # 去除重复的文件路径
    return list(set(json_files))

def generate_audio_for_json(json_file_path):
    """为单个JSON文件生成音频"""
    # 获取JSON文件名（不含扩展名）
    json_name = os.path.splitext(os.path.basename(json_file_path))[0]
    
    # 创建输出目录
    output_dir = os.path.join("audio", json_name)
    os.makedirs(output_dir, exist_ok=True)
    
    # 读取JSON文件
    try:
        with open(json_file_path, "r", encoding="utf-8") as f:
            words = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ JSON解析错误 {json_file_path}: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ 读取 {json_file_path} 失败: {str(e)}")
        return False
    
    print(f"🎵 开始处理: {json_name}")
    print(f"📁 源文件: {os.path.relpath(json_file_path)}")
    print(f"📁 输出到: {output_dir}")
    print("-" * 40)
    
    success_count = 0
    skip_count = 0
    error_count = 0
    
    for i, item in enumerate(words):
        text = item.get("text")
        if not text:
            print(f"⚠  第 {i+1} 项缺少 'text' 字段，跳过")
            continue
        
        filename = safe_filename(text) + ".mp3"
        audio_path = os.path.join(output_dir, filename)
        
        # 跳过已存在的文件
        if os.path.exists(audio_path):
            skip_count += 1
            continue
        
        # 生成SSML
        ssml = f"""
        <speak version="1.0" xml:lang="de-DE">
          <voice name="{VOICE}">
            <prosody rate="0.95">
              {text}
            </prosody>
          </voice>
        </speak>
        """
        
        # 生成音频
        try:
            audio_config = speechsdk.audio.AudioOutputConfig(
                filename=audio_path
            )
            
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speech_config,
                audio_config=audio_config
            )
            
            result = synthesizer.speak_ssml_async(ssml).get()
            
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                success_count += 1
                print(f"✅ [{i+1:3d}/{len(words):3d}] {json_name}/{filename}")
            else:
                error_count += 1
                print(f"❌ [{i+1:3d}/{len(words):3d}] {text}: 生成失败")
                
        except Exception as e:
            error_count += 1
            print(f"❌ [{i+1:3d}/{len(words):3d}] {text}: {str(e)[:100]}...")
    
    print(f"\n📊 {json_name} 处理完成:")
    print(f"   ✅ 成功生成: {success_count} 个音频")
    print(f"   ⏭ 跳过已存在: {skip_count} 个音频")
    print(f"   ❌ 失败: {error_count} 个")
    print(f"   📝 JSON总计: {len(words)} 个单词")
    
    return success_count > 0 or skip_count > 0

# =========================
# 主程序
# =========================
def main():
    # 检查参数
    if len(sys.argv) < 2:
        print("TTS音频批量生成脚本")
        print("=" * 50)
        print("用法: python tts_batch.py [文件/文件夹]")
        print()
        print("示例:")
        print("  1. 处理单个文件:")
        print("     python tts_batch.py Personen_und_Anrede.json")
        print("     python tts_batch.py Personen_und_Anrede")
        print()
        print("  2. 处理多个文件:")
        print("     python tts_batch.py file1.json file2.json file3.json")
        print()
        print("  3. 处理整个文件夹:")
        print("     python tts_batch.py ./json")
        print("     python tts_batch.py .")
        print()
        print("  4. 使用通配符:")
        print("     python tts_batch.py *.json")
        print("     python tts_batch.py json/*.json")
        print("     python tts_batch.py json/A*.json")
        print()
        print("  5. 处理当前目录所有JSON:")
        print("     python tts_batch.py .")
        print()
        print("  6. 处理特定文件夹:")
        print("     python tts_batch.py /path/to/json/folder")
        sys.exit(1)
    
    # 查找所有JSON文件
    json_files = find_all_json_files(sys.argv[1:])
    
    if not json_files:
        print("❌ 未找到任何JSON文件")
        print("💡 请检查:")
        print("   1. 文件路径是否正确")
        print("   2. 文件扩展名是否为 .json")
        print("   3. 文件是否存在")
        sys.exit(1)
    
    print(f"🔍 找到 {len(json_files)} 个JSON文件:")
    for i, file in enumerate(json_files[:20]):  # 最多显示20个
        print(f"   [{i+1:3d}] {os.path.relpath(file)}")
    
    if len(json_files) > 20:
        print(f"   ... 还有 {len(json_files)-20} 个文件未显示")
    
    print(f"\n📁 音频将保存到: audio/ 目录下")
    print("=" * 50)
    
    # 确认是否继续
    if len(json_files) > 5:
        print(f"⚠  即将处理 {len(json_files)} 个文件，是否继续? (y/n)")
        response = input().strip().lower()
        if response not in ['y', 'yes', '是']:
            print("操作取消")
            sys.exit(0)
    
    # 批量处理
    success_files = 0
    total_words = 0
    total_audio_generated = 0
    
    for i, json_file in enumerate(json_files):
        print(f"\n🎬 处理文件 [{i+1}/{len(json_files)}]: {os.path.basename(json_file)}")
        if generate_audio_for_json(json_file):
            success_files += 1
        
        # 读取单词数量
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                words = json.load(f)
                total_words += len(words)
        except:
            pass
        
        if i < len(json_files) - 1:
            print("\n" + "="*60)
    
    # 统计生成的音频文件总数
    total_audio_files = 0
    if os.path.exists("audio"):
        for root, dirs, files in os.walk("audio"):
            for file in files:
                if file.endswith('.mp3'):
                    total_audio_files += 1
    
    # 总结
    print("\n" + "="*60)
    print("🎉 批量处理完成!")
    print("="*60)
    print(f"📊 处理统计:")
    print(f"   📄 成功处理: {success_files}/{len(json_files)} 个JSON文件")
    print(f"   📝 总计单词: {total_words} 个")
    print(f"   🎵 音频文件: {total_audio_files} 个MP3文件")
    print(f"   📁 音频目录: audio/")
    print()
    print("📂 生成的音频目录结构:")
    
    # 显示音频目录结构
    if os.path.exists("audio"):
        audio_dirs = os.listdir("audio")
        for dir_name in sorted(audio_dirs):
            dir_path = os.path.join("audio", dir_name)
            if os.path.isdir(dir_path):
                mp3_count = len([f for f in os.listdir(dir_path) if f.endswith('.mp3')])
                print(f"   📁 audio/{dir_name}/ - {mp3_count} 个音频文件")
    else:
        print("   (audio/目录不存在)")
    
    print("="*60)

if __name__ == "__main__":
    main()





#     # 1. 处理整个json文件夹
# python tts_batch.py ./json

# # 2. 处理当前目录所有JSON文件
# python tts_batch.py .

# # 3. 处理特定文件夹
# python tts_batch.py /Users/me/Documents/deutsch-vokabeln/

# # 4. 混合使用：文件和文件夹
# python tts_batch.py file1.json ./json_folder file3.json

# # 5. 使用通配符
# python tts_batch.py json/A*.json json/B*.json