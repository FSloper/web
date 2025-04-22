#!/bin/bash

cd /vol2/1000/git/lottery_data

# 增加带重试机制的git pull函数
git_pull_with_retry() {
    local retry_count=0
    local max_retries=3
    
    while [ $retry_count -lt $max_retries ]; do
        if git pull; then
            echo "git pull成功"
            return 0
        else
            retry_count=$((retry_count+1))
            echo "git pull失败，正在重试($retry_count/$max_retries)..."
            sleep 1
        fi
    done
    
    echo "错误：git pull失败，已达到最大重试次数"
    return 1
}

# 使用带重试的pull函数
if ! git_pull_with_retry; then
    exit 1
fi

# 更新后的配置数组
lottery_configs=(
    "ssq:/vol2/1000/git/lottery_data/data/ssq_data.json:ssq_data"
    "kl8:/vol2/1000/git/lottery_data/data/kl8_data.json:kl8_data"
    "fc3d:/vol2/1000/git/lottery_data/data/fc3d_data.json:fc3d_data"
)

# 修改后的处理函数
process_lottery() {
    local lottery_type=$1
    local json_file=$2
    local data_type=$3

    /usr/bin/python3 "/vol2/1000/git/lottery_data_fetcher.py" "$lottery_type" "$json_file" "$data_type"

    # 检查JSON文件变更
    if git diff --quiet --exit-code "${json_file}"; then
        echo "${data_type}无更新"
    else
        git add .
        git commit -m "Auto-update ${data_type} $(date +'%Y-%m-%d %H:%M:%S')"
    fi
}

# 循环处理所有彩票类型
for config in "${lottery_configs[@]}"; do
    IFS=':' read -ra params <<< "$config"
    process_lottery "${params[0]}" "${params[1]}" "${params[2]}"
done

git push origin gh-pages