commit_regex='(\[MARTLH-[0-9]+\]\[MARTLH-[0-9]+\]|merge)'
error_msg="ERROR! Commit message should follow the pattern [MARTLH-1234][MARTLH-7890], where 1234 is the code of the story and 7890 is the code of the task."

if ! grep -iqE "$commit_regex" "$1"; then
    echo "$error_msg" >&2
    exit 1
fi

exit 0