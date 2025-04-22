import json
import requests
import sys

def fetch_lottery_data(lottery_type):
    base_url = 'http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.cwl.gov.cn/',
        'Content-Type': 'application/json',
    }
    
    params = {
        'name': lottery_type,
        'pageNo': 1,
        'systemType': 'PC',
        'pageSize': 10
    }
    
    if lottery_type == 'fc3d':
        params['name'] = '3d'
        
    try:
        response = requests.get(base_url, params=params, headers=headers)
        response.raise_for_status()
        response_data = response.json()
        
        if response_data.get('status') == 0:
            print(f"API Error: {lottery_type} data not available (status: 0)")
            return []
            
        if 'result' not in response_data:
            print(f"API Warning: Unexpected response format for {lottery_type}")
            print(f"Full response: {response_data}")
            return []
            
        return response_data['result']
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 500:
            print(f"API Server Error for {lottery_type}: The server encountered an internal error")
            print(f"Try checking the official website for updates to the API")
        else:
            print(f"HTTP Error fetching {lottery_type} data: {str(e)}")
        return []
    except requests.exceptions.RequestException as e:
        print(f"Network Error fetching {lottery_type} data: {str(e)}")
        return []
    except json.JSONDecodeError:
        print(f"Invalid JSON response for {lottery_type}")
        return []

def process_data(lottery_type, json_path, result):
    # 打印获取到的原始数据
    print(f"\n获取到的{lottery_type}数据：")
    for issue in result:
        print(f"期号: {issue['code']}, 号码: {issue['red']}{','+issue['blue'] if 'blue' in issue else ''}")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    new_data = {}
    added_count = 0

    for issue in result:
        if issue['code'] not in data:
            if lottery_type == 'ssq':
                numbers = f"{issue['red']},{issue['blue']}"
            elif lottery_type == 'kl8':
                numbers = f"{issue['red']}"
            elif lottery_type == 'fc3d':
                numbers = f"{issue['red']}"
                
            new_data[issue['code']] = numbers
            print(f"添加新数据: {issue['code']} - {numbers}")
            added_count += 1

    if new_data:
        new_data.update(data)
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, ensure_ascii=False, indent=2)
        print(f"成功添加 {added_count} 期{lottery_type}新数据")
        
        # 新增：保存前3行到新文件
        output_path = json_path.replace('.json', '_first3.json')
        with open(json_path, 'r', encoding='utf-8') as f:
            first_three = [next(f) for _ in range(3)]
            
        with open(output_path, 'w', encoding='utf-8') as f:
            f.seek(0)
            f.truncate()
            f.writelines(first_three)
            last_line = first_three[-1].rstrip()
            if last_line.endswith(','):
                first_three[-1] = last_line[:-1] + '\n'
            f.seek(0)
            f.truncate()
            f.writelines(first_three)
            f.write("}")
        print(f"已保存前3行数据到{output_path}")
    else:
        print("没有需要更新的新数据")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python lottery_data_fetcher.py <lottery_type> <json_path> <data_type>")
        sys.exit(1)
        
    lottery_type = sys.argv[1]
    json_path = sys.argv[2]
    data_type = sys.argv[3]
    
    result = fetch_lottery_data(lottery_type)
    process_data(data_type, json_path, result)