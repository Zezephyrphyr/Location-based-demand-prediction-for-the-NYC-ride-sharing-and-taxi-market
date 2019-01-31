class Solution:
    def expandAroundCenter(self, s, idx_left, idx_right):
        """
        :type s: str
        :type idx_left: int
        :type idx_right: int
        :rtype: int
        """
        while idx_left >= 0 and idx_right < len(s) and s[idx_left] == s[idx_right]:
            idx_left -= 1
            idx_right += 1
        # for i, i case: 1, 3, 5...
        # for i, i+1 case: 0, 2, 4...
        return idx_right - idx_left - 1


    # Expand Around Center
    def longestPalindrome_eac(self, s):
        """
        :type s: str
        :rtype: str
        """
        start = end = 0
        for i in range(len(s)):
            len1 = self.expandAroundCenter(s, i, i)
            len2 = self.expandAroundCenter(s, i, i+1)
            maxLen = max(len1, len2)

            if maxLen > end - start:
                """
                two cases:
                len = even number: _ i i+1 _
                len = odd number: _ i _
                """
                start = i - int((maxLen-1) / 2)
                end = i + int(maxLen / 2)
        return s[start:end+1]

    # Brute Force
    def longestPalindrome_naive(self, s):
        """
        :type s: str
        :rtype: str
        """
        maximum = ""
        for idx_start in range(len(s)):
            #for idx_end in range(idx_start+1,len(s)+1):
            if idx_start+len(maximum)+1 > len(s)+1:
                break
            for idx_end in range(idx_start+len(maximum)+1,len(s)+1):
                fw = s[idx_start:idx_end]
                if fw == fw[::-1] and len(fw) > len(maximum):
                    maximum = fw
        return maximum

if __name__ == '__main__':
    string = 'cbababa'
    mySolution = Solution()
    ans = mySolution.longestPalindrome_naive(string)
    print('Solution is: {}'.format(ans))
