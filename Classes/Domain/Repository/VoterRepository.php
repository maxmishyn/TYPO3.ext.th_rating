<?php
namespace Thucke\ThRating\Domain\Repository;
/***************************************************************
*  Copyright notice
*
*  (c) 2010 Thomas Hucke <thucke@web.de> 
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

/**
 * A repository for votes
 */
class VoterRepository extends \TYPO3\CMS\Extbase\Domain\Repository\FrontendUserRepository {		
	
	/**
	 * Initialze this repository
	 */
	public function initializeObject() {
		$configurationManager = $this->objectManager->get(\TYPO3\CMS\Extbase\Configuration\ConfigurationManager::class);
		//Even hidden or deleted FE Users  should be found
		$this->defaultQuerySettings = $this->objectManager->get(\TYPO3\CMS\Extbase\Persistence\Generic\Typo3QuerySettings::class);
		$this->defaultQuerySettings->setIgnoreEnableFields(true);
	}
}
