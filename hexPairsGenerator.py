

hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
num0 = ''
num1 = ''
pair = ''
line = ''
body = ''

for i in hex:
    for j in hex:
        num0 = r'"\\x' + i + j + r'"'
        num1 = r'"\x' + i + j + r'"'
        pair = num0 + ' : ' + num1
        line = pair + "," + '\n'
        body += line

print(body)        
