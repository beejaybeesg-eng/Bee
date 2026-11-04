import os
os.chdir(os.environ.get('VV_REPO') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
tracks=[('01','NHO_KHONG'),('02','MOI_THI_CHOI'),('04','NHAN_VUI'),('05','ANH_BE_LY_CAY_CHO'),('06','DAU_DAU_MUA'),('07','U_NGON_NGU_NGANH'),('08','TU_VIEN_SAI_GON'),('09','QUANG_DAU'),('10','PHAI')]
rd=lambda f: open(f,encoding='utf-8').read().strip()
parts=['# VINAVVAVE 短视频系列 · 全部（九首）\n\nBEEJAYBEE · 剩下九集的创意、拍摄脚本与分镜。iPhone 16 Pro Max 一部，一个人拍，每集 ≤ 3 小时。\n\n带分镜图的完整版见同目录的 **全部_分镜脚本.pdf**（每首也有单独的 PDF，在 `pdf/` 里）。\n\n**目录**\n- 总览\n- 拍摄通用参数（iPhone 16 Pro Max）\n- 三位导演原稿 + 每首三个剪辑版本\n'+'\n'.join(f'- {n} · 一页纸 + 拍摄脚本' for n,_ in tracks)]
parts+= [rd('00_总览.md'), rd('拍摄通用参数_iPhone16ProMax.md'), rd('导演稿与剪辑方案.md')]
for n,s in tracks: parts+= [rd(f'{n}_{s}.md'), rd(f'{n}_{s}_拍摄脚本.md')]
open('全部.md','w',encoding='utf-8').write('\n\n---\n\n'.join(parts)+'\n'); print('全部.md ok')
