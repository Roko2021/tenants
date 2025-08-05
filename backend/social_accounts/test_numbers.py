# import numpy as np
# def count(m):
#     s=np.array(m)
#     a=np.max(s)
#     total=np.sum(s == a)
#     element=[]
#     for j in range(len(s)):
#         if j not in element:
#             for i in range(j+1,len(s)):
#                 if (s[j]+s[i]) == a: 
#                     total+=1
#                     element.append(i)
#     return total


# s=[22,12,13,22,22,22,14,22,17,22]
# s1=[8,13,7,13,5,13,4,13,13,6]

# # print(count(s))
# # print(count(s1))
# # sh=np.array(s)+np.array(s1)
# # print(sh)
# print(filter(s,22))

def solutions(s:str)->str:
    s=s.lower()
    answer=[]
    hashtag=["$"]
    result=""
    for i in s:
        # print(answer)
        # print(i)
        if i not in answer and i not in hashtag:
            answer.append(i)
            
    result="".join(answer)
    # print(result)
    # return result
    return "".join(result)
    




s="acba$df"
# a=input()
output=solutions(s)
print(output)
# for i in s:
#     print(i)