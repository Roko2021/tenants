from collections import Counter
s1 = "geeks"
s2 = "eggkf"
k = 1

count1 = 0
count2 = 0
example1 = []
example2 = []
count3=0
count4=0
set1=[]
set2=[]
# for i in range(len(s1)):
#     print("s1[i]",set1)
#     if s1[i] not in set1:
#         set1.append(s1[i])
#     else:
#         count3+=1
    
# for i in range(len(s1)):



# c1, c2 = Counter(s1), Counter(s2)

# print(c1)
# print(c2)

# for i in range(len(s1)):
#     print(c2[s1[i]])
#     if c2[s1[i]] <= 0:
#         k-=1
#     elif c2[s1[i]] > 0:
#         c2[s1[i]] -= 1
        
# return  k >= 0
# answer= count1 + count3
# print(count1)
# print(count2)
# print(f"count3 is: ", count3)
# print(example1)
# print(f"set1 is: {set1}")


# import string

# alphabet_list = list(string.ascii_lowercase)

# s = "Bawds jog, flick quartz, vex nymph"

# count = 0

# for i in range(len(s)):
#     if s[i] in alphabet_list:
#         count += 1

# print(count)

# import math

# s = "geeksforgeeks"
# a=math.ceil(len(s)/2)
# for i in range(2,len(s)):
#     print(i)


import math
s=["hello","helo","hi","hihi","hleo"]

h=25
a=max(s)
result=0
# for i in range(len(s)):
j=0

while j<len(s):
    answer=""
    # print(i)
    # set(s[i])
    answer="".join(sorted(set(s[j])))
    # answer2="".join(sorted(set(s[i-1])))
    print(answer)
    j+=1
    i=0
    while i<(len(s)-1):
        answer2="".join(sorted(set(s[i+1])))
        print(answer2)
        i+=1
        if answer==answer2:
            print("here",i)
            s.remove(s[i])
            result+=1

    # print(answer)
    # print(answer2)
    # if answer == answer2:
    #     result +=1
    #     print(answer)
    #     print(answer2)
    # for j in range(1,len(s)):

# print(answer)
print(result)
# print(math.ceil(result/2))