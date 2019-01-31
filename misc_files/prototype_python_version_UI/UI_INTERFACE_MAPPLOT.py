import webbrowser
from getGrids_GMPLOT import test
import os
current_working_directory = os.getcwd()
#print(current_working_directory)



def click():
    a = test(date.get(),time.get(),bool_list[0],max_list[0])

    a.printText()
    a.drawMap()
    max_list[0] =a.getMax()
    if bool_list[0]:
        print('currentMax'+str(max_list[0]))
    print('finished')
    #print(date.get())
    #print(time.get())
    openMap()

def openMap():
    fileLocation = 'file://'+current_working_directory+'/test_heatmap'+str(date.get())+'at'+str(time.get())+'.html'
    webbrowser.open_new(str(fileLocation))


bool_list=[]
bool_list.append(False)

def setAllHourOneDay():


    bool_list[0] = not bool_list[0]
    label3 = Label(root, text="CompareMode:"+str(bool_list[0]), font=("arial",20,"bold"), fg="black").place(x=20,y=600)
    print(bool_list[0])

max_list =[0.]

#import tkinter as tk
from tkinter import *



root = Tk()

root.title('Name')
root.geometry("800x640+0+0")

heading = Label(root, text="Enter date and hour you want to query:", font=("arial",40, "bold"), fg="steelblue").pack()

label1 = Label(root, text="Date: (Eg.'2018-12-01')", font=("arial",20,"bold"), fg="black").place(x=10,y=200)
date = StringVar()
e1 = Entry(root,textvariable = date)
e1.pack()
e1.place(x=250,y=200)

label2 = Label(root, text="Hour: (Int: Eg.'16')", font=("arial",20,"bold"), fg="black").place(x=10,y=300)
time =StringVar()
e2 = Entry(root,textvariable = time)
e2.pack()
e2.place(x=250,y=300)
#e2.focus_set()


#b1 = Button(root,text='CompareMode', width=30,height=5, bg="green",command=setAllHourOneDay)
#b1.place(relx=.5, rely=.5, anchor="c")
#b1.pack(side ='top')

b = Button(root,text='Submit', width=10,height=5, fg="black",command=click)
b.place(relx=.5, rely=.5, anchor="c")
b.pack(side ='bottom',padx=200,pady=200)
#b.pack(side='bottom')




root.mainloop()

